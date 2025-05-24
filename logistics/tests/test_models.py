import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta

from logistics.models import Booking, Vehicle

# Model creation tests
@pytest.mark.django_db
def test_booking_creation(sample_booking):
    """Test that a booking can be created with valid data"""
    assert sample_booking.booking_number == "BK-TEST-FIXTURE"
    assert sample_booking.loading_port == "Rotterdam"
    assert sample_booking.discharge_port == "Singapore"

@pytest.mark.django_db
def test_booking_string_representation(sample_booking):
    """Test the string representation of a booking"""
    assert str(sample_booking) == f"Booking {sample_booking.booking_number}"

@pytest.mark.django_db
def test_booking_date_validation():
    """Test validation that departure date must be before arrival date"""
    current_time = timezone.now()
    
    # Create booking with invalid dates (departure after arrival)
    with pytest.raises(ValidationError) as excinfo:
        booking = Booking(
            booking_number="BK-INVALID-DATE",
            loading_port="Amsterdam",
            discharge_port="Tokyo",
            ship_departure_date=current_time + timedelta(days=7),
            ship_arrival_date=current_time
        )
        booking.full_clean()  # This triggers validation
    
    # Check that the error message is as expected
    assert "Ship departure date must be before arrival date" in str(excinfo.value)

@pytest.mark.django_db
def test_add_vehicle_to_booking(sample_booking):
    """Test adding a vehicle to a booking"""
    vehicle = Vehicle.objects.create(
        vin="TEST123456789ABCDE",
        make="Ford",
        model="Focus",
        weight=1500.00
    )
    
    result = sample_booking.addVehicleToBooking(vehicle)
    
    # Check that the vehicle was properly associated
    assert result.booking == sample_booking
    
    # Also verify by fetching from DB
    refreshed_vehicle = Vehicle.objects.get(vin="TEST123456789ABCDE")
    assert refreshed_vehicle.booking == sample_booking

@pytest.mark.django_db
def test_vehicle_creation(sample_vehicle):
    """Test that a vehicle can be created with valid data"""
    assert sample_vehicle.vin == "PYTEST1234567890ABC"
    assert sample_vehicle.make == "Tesla"
    assert sample_vehicle.model == "Model 3"
    assert sample_vehicle.weight == 1800.00
    assert sample_vehicle.booking is not None
    
@pytest.mark.django_db
def test_vehicle_string_representation(sample_vehicle):
    """Test the string representation of a vehicle"""
    assert str(sample_vehicle) == f"Tesla Model 3 (PYTEST1234567890ABC)"

@pytest.mark.django_db
def test_create_vehicle_class_method():
    """Test the createVehicle class method"""
    vehicle = Vehicle.createVehicle(
        vin="1FTEW1E85AFA12345",  # Valid 17-char VIN that matches the pattern
        make="BMW",
        model="X5",
        weight=2100.00
    )
    
    assert vehicle.vin == "1FTEW1E85AFA12345"
    assert vehicle.make == "BMW"
    assert vehicle.model == "X5"
    assert vehicle.weight == 2100.00

@pytest.mark.django_db
def test_create_random_vehicle(sample_booking):
    """Test creating a random vehicle"""
    vehicle = Vehicle.createVehicleRandom(booking=sample_booking)
    
    assert vehicle.vin is not None
    assert len(vehicle.vin) == 17  # Valid VIN length
    assert vehicle.make is not None
    assert vehicle.model is not None
    assert vehicle.weight > 0
    assert vehicle.booking == sample_booking