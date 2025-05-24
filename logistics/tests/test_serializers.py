import pytest
from django.utils import timezone
from datetime import timedelta

from logistics.models import Booking, Vehicle
from logistics.serializers import BookingSerializer, VehicleSerializer

@pytest.mark.django_db
class TestBookingSerializer:
    """Tests for the BookingSerializer"""
    
    def test_serialize_booking(self, sample_booking):
        """Test serializing a booking instance"""
        serializer = BookingSerializer(sample_booking)
        data = serializer.data
        
        assert data["booking_number"] == "BK-TEST-FIXTURE"
        assert data["loading_port"] == "Rotterdam"
        assert data["discharge_port"] == "Singapore"
        assert "vehicle_count" in data
    
    def test_deserialize_booking(self):
        """Test deserializing data to create a booking"""
        departure_date = timezone.now()
        arrival_date = departure_date + timedelta(days=7)
        
        booking_data = {
            "booking_number": "BK-DESERIALIZE",
            "loading_port": "Hamburg",
            "discharge_port": "New York",
            "ship_departure_date": departure_date.isoformat(),
            "ship_arrival_date": arrival_date.isoformat()
        }
        
        serializer = BookingSerializer(data=booking_data)
        assert serializer.is_valid(), f"Serializer errors: {serializer.errors}"
        
        booking = serializer.save()
        assert booking.booking_number == "BK-DESERIALIZE"
        assert booking.loading_port == "Hamburg"
        assert booking.discharge_port == "New York"
    
    def test_invalid_date_validation(self):
        """Test validation fails when departure is after arrival"""
        departure_date = timezone.now() + timedelta(days=7)  # Later date
        arrival_date = timezone.now()  # Earlier date
        
        booking_data = {
            "booking_number": "BK-INVALID-DATE",
            "loading_port": "Hamburg",
            "discharge_port": "New York",
            "ship_departure_date": departure_date.isoformat(),
            "ship_arrival_date": arrival_date.isoformat()
        }
        
        serializer = BookingSerializer(data=booking_data)
        assert not serializer.is_valid()
        
        # The error message might be in different places depending on serializer implementation
        errors_string = str(serializer.errors)
        assert ("date" in errors_string.lower() or 
                "departure" in errors_string.lower() or 
                "arrival" in errors_string.lower())

@pytest.mark.django_db
class TestVehicleSerializer:
    """Tests for the VehicleSerializer"""
    
    def test_serialize_vehicle(self, sample_vehicle):
        """Test serializing a vehicle instance"""
        serializer = VehicleSerializer(sample_vehicle)
        data = serializer.data
        
        assert data["vin"] == "PYTEST1234567890ABC"
        assert data["make"] == "Tesla"
        assert data["model"] == "Model 3"
        assert float(data["weight"]) == 1800.00
        assert data["booking"] == sample_vehicle.booking.id
    
    def test_deserialize_vehicle(self, sample_booking):
        """Test deserializing data to create a vehicle"""
        vehicle_data = {
            "vin": "5YJSA1E28HF177834",  # Valid 17-char VIN
            "make": "Honda",
            "model": "Civic",
            "weight": 1200.00,
            "booking": sample_booking.id
        }
        
        serializer = VehicleSerializer(data=vehicle_data)
        assert serializer.is_valid(), f"Serializer errors: {serializer.errors}"
        
        vehicle = serializer.save()
        assert vehicle.vin == "5YJSA1E28HF177834"
        assert vehicle.make == "Honda"
        assert vehicle.model == "Civic"
        assert float(vehicle.weight) == 1200.00
        assert vehicle.booking == sample_booking