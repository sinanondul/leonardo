import pytest
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient

from logistics.models import Booking, Vehicle

@pytest.fixture
def api_client():
    """Return an authenticated API client"""
    return APIClient()

@pytest.fixture
def sample_booking():
    """Create a sample booking for tests"""
    departure_date = timezone.now()
    arrival_date = departure_date + timedelta(days=7)
    
    booking = Booking.objects.create(
        booking_number="BK-TEST-FIXTURE",
        loading_port="Rotterdam",
        discharge_port="Singapore",
        ship_departure_date=departure_date,
        ship_arrival_date=arrival_date
    )
    return booking

@pytest.fixture
def sample_vehicle(sample_booking):
    """Create a sample vehicle linked to the sample booking"""
    vehicle = Vehicle.objects.create(
        vin="PYTEST1234567890ABC",
        make="Tesla",
        model="Model 3",
        weight=1800.00,
        booking=sample_booking
    )
    return vehicle