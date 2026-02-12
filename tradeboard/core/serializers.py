from rest_framework import serializers
from .models import *


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = "__all__"


class ShipmentEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipmentEvent
        fields = "__all__"


class ShipmentSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)
    events = ShipmentEventSerializer(many=True, read_only=True)
    buyer_name = serializers.CharField(source="buyer.name", read_only=True)
    class Meta:
        model = Shipment
        fields = "__all__"
        read_only_fields = ["total_fob"]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be positive")
        return value