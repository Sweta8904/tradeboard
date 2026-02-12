from django.core.management.base import BaseCommand
from core.models import *
from django.utils import timezone
import random
from datetime import timedelta


class Command(BaseCommand):
    def handle(self, *args, **kwargs):

        buyer = Buyer.objects.create(
            name="ABC Imports",
            country="USA",
            email="abc@test.com"
        )

        product = Product.objects.create(
            name="Rice",
            description="Basmati",
            unit_price=100
        )

        for i in range(50):

            invoice_date = timezone.now().date() - timedelta(
                days=random.randint(10, 90)
            )

            shipment = Shipment.objects.create(
                shipment_number=f"SHP{i}",
                buyer=buyer,
                product=product,
                quantity=random.randint(10, 100),
                unit_price=100,
                payment_terms=30,
                invoice_date=invoice_date,
                status=random.choice(
                    [s[0] for s in Shipment.STATUS_CHOICES]
                )
            )

            # Overdue payments (3-4 shipments)
            if i < 4:
                shipment.invoice_date = timezone.now().date() - timedelta(days=120)
                shipment.payment_terms = 30
                shipment.payment_status = "pending"
                shipment.save()

            # Customs held (2 shipments)
            if 5 <= i < 7:
                shipment.status = "CUSTOMS_HELD"
                shipment.status_updated_at = timezone.now() - timedelta(days=10)
                shipment.save()

            # Create 7 documents per shipment
            doc_names = [
                "Tax Invoice", "Packing List", "Bill of Lading",
                "Shipping Bill", "Certificate of Origin",
                "Insurance", "Inspection Certificate"
            ]

            for doc in doc_names:
                Document.objects.create(
                    shipment=shipment,
                    name=doc,
                    status=random.choice(["not_started", "draft", "ready"])
                )

        self.stdout.write(self.style.SUCCESS("Seed data created successfully!"))
