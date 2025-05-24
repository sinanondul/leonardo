import pytest
from django.urls import reverse
from rest_framework import status

from logistics.models import Booking, Vehicle

@pytest.mark.django_db
class TestBookingViewSet:
    """Tests for the BookingViewSet API endpoints"""
    
    def test_list_bookings(self, api_client, sample_booking):
        """Test retrieving a list of bookings"""
        url = reverse('logistics:booking-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        
        # Check if response is paginated
        if 'results' in response.data:
            bookings = response.data['results']
        else:
            bookings = response.data
        
        # Check that our sample booking is in the results
        booking_exists = False
        for booking in bookings:
            if booking['booking_number'] == sample_booking.booking_number:
                booking_exists = True
                break
        
        assert booking_exists, "Sample booking not found in response"
    
    def test_create_booking(self, api_client):
        """Test creating a new booking through the API"""
        url = reverse('logistics:booking-list')
        booking_data = {
            "booking_number": "BK-API-TEST",
            "loading_port": "Rotterdam",
            "discharge_port": "Singapore",
            "ship_departure_date": "2025-06-01T10:00:00Z",
            "ship_arrival_date": "2025-06-08T10:00:00Z"
        }
        
        response = api_client.post(url, booking_data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['booking_number'] == "BK-API-TEST"
        assert response.data['loading_port'] == "Rotterdam"
        
        # Verify it was actually created in the database
        assert Booking.objects.filter(booking_number="BK-API-TEST").exists()
    
    def test_retrieve_booking(self, api_client, sample_booking):
        """Test retrieving a single booking"""
        url = reverse('logistics:booking-detail', args=[sample_booking.id])
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['booking_number'] == sample_booking.booking_number
        assert response.data['loading_port'] == sample_booking.loading_port
    
    def test_update_booking(self, api_client, sample_booking):
        """Test updating a booking"""
        url = reverse('logistics:booking-detail', args=[sample_booking.id])
        update_data = {
            "booking_number": sample_booking.booking_number,
            "loading_port": "Amsterdam",  # Changed from Rotterdam
            "discharge_port": sample_booking.discharge_port,
            "ship_departure_date": sample_booking.ship_departure_date.isoformat(),
            "ship_arrival_date": sample_booking.ship_arrival_date.isoformat()
        }
        
        response = api_client.put(url, update_data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['loading_port'] == "Amsterdam"
        
        # Verify it was updated in the database
        updated_booking = Booking.objects.get(id=sample_booking.id)
        assert updated_booking.loading_port == "Amsterdam"
    
    def test_delete_booking(self, api_client, sample_booking):
        """Test deleting a booking"""
        url = reverse('logistics:booking-detail', args=[sample_booking.id])
        
        response = api_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Booking.objects.filter(id=sample_booking.id).exists()
    
    def test_export_excel(self, api_client, sample_booking):
        """Test exporting bookings to Excel"""
        url = reverse('logistics:booking-export-excel')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response['Content-Type'] == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        assert 'attachment; filename=' in response['Content-Disposition']

@pytest.mark.django_db
class TestVehicleViewSet:
    """Tests for the VehicleViewSet API endpoints"""
    
    def test_list_vehicles(self, api_client, sample_vehicle):
        """Test retrieving a list of vehicles"""
        url = reverse('logistics:vehicle-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        
        # Check if response is paginated
        if 'results' in response.data:
            vehicles = response.data['results']
        else:
            vehicles = response.data
        
        # Check that our sample vehicle is in the results
        vehicle_exists = False
        for vehicle in vehicles:
            if vehicle['vin'] == sample_vehicle.vin:
                vehicle_exists = True
                break
        
        assert vehicle_exists, "Sample vehicle not found in response"
    
    def test_filtered_vehicles(self, api_client, sample_booking, sample_vehicle):
        """Test retrieving vehicles filtered by booking"""
        url = reverse('logistics:vehicle-list')
        response = api_client.get(f"{url}?booking={sample_booking.id}")
        
        assert response.status_code == status.HTTP_200_OK
        
        # Check if response is paginated
        if 'results' in response.data:
            vehicles = response.data['results']
        else:
            vehicles = response.data
        
        # All vehicles should belong to the specified booking
        for vehicle in vehicles:
            assert vehicle['booking'] == sample_booking.id
    
    def test_create_vehicle(self, api_client, sample_booking):
        """Test creating a vehicle"""
        url = reverse('logistics:vehicle-create-vehicle')
        vehicle_data = {
            "vin": "WBAFG41090L359453",  # Valid 17-char VIN
            "make": "Honda",
            "model": "Civic",
            "weight": 1200.00,
            "booking": sample_booking.id
        }
        
        response = api_client.post(url, vehicle_data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['vin'] == "WBAFG41090L359453"
        assert response.data['make'] == "Honda"
        
        # Verify it was created in the database
        assert Vehicle.objects.filter(vin="WBAFG41090L359453").exists()
    
    def test_create_random_vehicle(self, api_client, sample_booking):
        """Test creating a random vehicle"""
        url = reverse('logistics:vehicle-create-random-vehicle')
        
        response = api_client.post(url, {"booking": sample_booking.id}, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'vin' in response.data
        assert 'make' in response.data
        assert 'model' in response.data
        
        # Verify a vehicle was created and linked to the booking
        created_vehicle = Vehicle.objects.get(vin=response.data['vin'])
        assert created_vehicle.booking == sample_booking
    
    def test_add_vehicle_to_booking(self, api_client, sample_booking):
        """Test adding a vehicle to a booking through the API"""
        # Create a vehicle without a booking
        vehicle = Vehicle.objects.create(
            vin="ADDTOBOOK1234567890",
            make="BMW",
            model="X5",
            weight=2100.00
        )
        
        url = reverse('logistics:vehicle-add-to-booking', args=[vehicle.id])
        data = {'booking_id': sample_booking.id}
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'message' in response.data
        assert response.data['vehicle']['booking'] == sample_booking.id
        
        # Verify in database
        updated_vehicle = Vehicle.objects.get(id=vehicle.id)
        assert updated_vehicle.booking == sample_booking
    
    def test_export_excel(self, api_client, sample_vehicle):
        """Test exporting vehicles to Excel"""
        url = reverse('logistics:vehicle-export-excel')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response['Content-Type'] == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        assert 'attachment; filename=' in response['Content-Disposition']
    
    def test_export_csv(self, api_client, sample_vehicle):
        """Test exporting vehicles to CSV"""
        url = reverse('logistics:vehicle-export-csv')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response['Content-Type'] == 'text/csv'
        assert 'attachment; filename=' in response['Content-Disposition']