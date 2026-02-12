from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ShipmentViewSet,
    DocumentViewSet,
    DashboardSummary,
    DashboardAlerts,
    ShipmentsByStatus,
    MonthlyTrend,
)

router = DefaultRouter()
router.register(r"shipments", ShipmentViewSet)
router.register(r"documents", DocumentViewSet)

urlpatterns = [
    path("", include(router.urls)),

    path("dashboard/summary/", DashboardSummary.as_view()),
    path("dashboard/alerts/", DashboardAlerts.as_view()),

    path("analytics/shipments-by-status/", ShipmentsByStatus.as_view()),
    path("analytics/monthly-trend/", MonthlyTrend.as_view()),
]
