from rest_framework import serializers
from .models import Booking, Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'vin', 'make', 'model', 'weight', 'booking', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class BookingSerializer(serializers.ModelSerializer):
    vehicles = VehicleSerializer(many=True, read_only=True)
    vehicle_count = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ['id', 'booking_number', 'loading_port', 'discharge_port',
                  'ship_arrival_date', 'ship_departure_date', 'vehicles',
                  'vehicle_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_vehicle_count(self, obj):
        return obj.vehicles.count()

    def validate(self, data):
        """
        Check that ship_departure_date is before ship_arrival_date
        """
        if data.get('ship_departure_date') and data.get('ship_arrival_date'):
            if data['ship_departure_date'] > data['ship_arrival_date']:
                raise serializers.ValidationError("Ship departure date must be before arrival date")
        return data