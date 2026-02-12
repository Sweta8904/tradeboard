from django.db import models
from django.utils import timezone


class Buyer(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return self.name


class Shipment(models.Model):

    STATUS_CHOICES = [
        ("ORDER_RECEIVED", "Order Received"),
        ("DOCUMENTS_IN_PROGRESS", "Documents In Progress"),
        ("DOCUMENTS_READY", "Documents Ready"),
        ("CUSTOMS_FILED", "Customs Filed"),
        ("CUSTOMS_HELD", "Customs Held"),
        ("CUSTOMS_CLEARED", "Customs Cleared"),
        ("SHIPPED", "Shipped"),
        ("IN_TRANSIT", "In Transit"),
        ("ARRIVED", "Arrived"),
        ("DELIVERED", "Delivered"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    PAYMENT_STATUS = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("overdue", "Overdue"),
    ]

    shipment_number = models.CharField(max_length=50, unique=True)

    buyer = models.ForeignKey(Buyer, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_fob = models.DecimalField(max_digits=14, decimal_places=2)

    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="ORDER_RECEIVED")

    payment_terms = models.IntegerField(help_text="Days")
    invoice_date = models.DateField(default=timezone.now)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="pending")

    estimated_departure = models.DateField(null=True, blank=True)

    status_updated_at = models.DateTimeField(auto_now=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.total_fob = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return self.shipment_number


class Document(models.Model):

    DOC_STATUS = [
        ("not_started", "Not Started"),
        ("draft", "Draft"),
        ("ready", "Ready"),
        ("verified", "Verified"),
    ]

    shipment = models.ForeignKey(Shipment, related_name="documents", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=DOC_STATUS, default="not_started")

    def __str__(self):
        return f"{self.name} - {self.shipment.shipment_number}"


class ShipmentEvent(models.Model):
    shipment = models.ForeignKey(Shipment, related_name="events", on_delete=models.CASCADE)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description
