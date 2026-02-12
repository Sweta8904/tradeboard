from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth

from .models import Shipment, ShipmentEvent, Document
from .serializers import ShipmentSerializer, DocumentSerializer
from .status_machine import ALLOWED_TRANSITIONS


# ------------------ SHIPMENT VIEWSET ------------------

class ShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipment.objects.all().order_by("-created_at")
    serializer_class = ShipmentSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["status", "buyer", "payment_status"]
    search_fields = ["shipment_number", "buyer__name"]

    @action(detail=True, methods=["get"])
    def allowed_transitions(self, request, pk=None):
        shipment = self.get_object()
        allowed = ALLOWED_TRANSITIONS.get(shipment.status, [])
        return Response({"allowed": allowed})
    @action(detail=True, methods=["post"])
    def change_status(self, request, pk=None):
        shipment = self.get_object()
        new_status = request.data.get("status")

        if not new_status:
            return Response(
                {"error": "Status is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        allowed = ALLOWED_TRANSITIONS.get(shipment.status, [])

        if new_status not in allowed:
            return Response(
                {
                    "error": f"Invalid transition: cannot move from {shipment.status} to {new_status}. Allowed next states: {allowed}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        old_status = shipment.status
        shipment.status = new_status
        shipment.save()

        ShipmentEvent.objects.create(
            shipment=shipment,
            description=f"Status changed from {old_status} to {new_status}",
        )

        return Response({"message": "Status updated successfully"})
# ------------------ DOCUMENT VIEWSET ------------------

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_status = instance.status

        response = super().update(request, *args, **kwargs)

        instance.refresh_from_db()

        if old_status != instance.status:
            ShipmentEvent.objects.create(
                shipment=instance.shipment,
                description=f"{instance.name} changed from {old_status} to {instance.status}"
            )

        return response


# ------------------ DASHBOARD ------------------

class DashboardSummary(APIView):
    def get(self, request):
        today = timezone.now().date()

        active = Shipment.objects.exclude(
            status__in=["COMPLETED", "CANCELLED"]
        )

        overdue_count = 0
        overdue_value = 0

        for shipment in Shipment.objects.exclude(payment_status="paid"):
            due_date = shipment.invoice_date + timedelta(
                days=shipment.payment_terms + 30
            )

            if today > due_date:
                overdue_count += 1
                overdue_value += shipment.total_fob

        total_value = sum(s.total_fob for s in active)

        return Response({
            "total_active": active.count(),
            "overdue_count": overdue_count,
            "overdue_value": overdue_value,
            "total_value": total_value,
        })



class DashboardAlerts(APIView):
    def get(self, request):
        alerts = []
        today = timezone.now().date()

        for shipment in Shipment.objects.all():

            if shipment.payment_status != "paid":
                due_date = shipment.invoice_date + timedelta(days=shipment.payment_terms + 30)
                if today > due_date:
                    alerts.append({
                        "type": "critical",
                        "message": f"{shipment.shipment_number} payment overdue"
                    })

            if shipment.status == "CUSTOMS_HELD":
                if shipment.status_updated_at.date() + timedelta(days=5) < today:
                    alerts.append({
                        "type": "warning",
                        "message": f"{shipment.shipment_number} stuck in customs"
                    })

        return Response(alerts)


# ------------------ ANALYTICS ------------------

class ShipmentsByStatus(APIView):
    def get(self, request):
        data = Shipment.objects.values("status").annotate(count=Count("id"))
        return Response(data)


class MonthlyTrend(APIView):
    def get(self, request):
        data = (
            Shipment.objects
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(
                shipment_count=Count("id"),
                total_value=Sum("total_fob")
            )
            .order_by("month")
        )
        return Response(data)


