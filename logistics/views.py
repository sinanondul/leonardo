from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.http import HttpResponse
from datetime import timedelta
from .models import Booking, Vehicle
from .serializers import BookingSerializer, VehicleSerializer
from .resources import BookingResource, VehicleResource
import csv
import xlwt
from io import BytesIO


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    @action(detail=True, methods=['post'])
    def add_vehicle(self, request, pk=None):
        booking = self.get_object()
        vehicle_id = request.data.get('vehicle_id')

        if not vehicle_id:
            return Response(
                {'error': 'Vehicle ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            vehicle = Vehicle.objects.get(pk=vehicle_id)
            booking.addVehicleToBooking(vehicle)

            return Response(
                {'message': f'Vehicle {vehicle.vin} successfully added to booking {booking.booking_number}'},
                status=status.HTTP_200_OK
            )
        except Vehicle.DoesNotExist:
            return Response(
                {'error': f'Vehicle with id {vehicle_id} does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['delete'])
    def delete_old_vehicles(self, request):
        six_months_ago = timezone.now() - timedelta(days=180)

        old_vehicles = Vehicle.objects.filter(
            booking__ship_arrival_date__lt=six_months_ago
        )

        count = old_vehicles.count()
        old_vehicles.delete()

        return Response(
            {'message': f'Deleted {count} vehicles with bookings older than 6 months'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        resource = BookingResource()
        dataset = resource.export()
        response = HttpResponse(dataset.csv, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="bookings.csv"'
        return response

    @action(detail=False, methods=['get'])
    def export_excel(self, request):
        resource = BookingResource()
        dataset = resource.export()
        response = HttpResponse(dataset.xls, content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename="bookings.xls"'
        return response


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

    @action(detail=False, methods=['post'])
    def create_vehicle(self, request):
        try:
            vin = request.data.get('vin')
            make = request.data.get('make')
            model = request.data.get('model')
            weight = request.data.get('weight')
            booking_id = request.data.get('booking')

            if not all([vin, make, model, weight]):
                return Response(
                    {'error': 'Missing required fields. Please provide vin, make, model, and weight.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            booking = None
            if booking_id:
                try:
                    booking = Booking.objects.get(pk=booking_id)
                except Booking.DoesNotExist:
                    return Response(
                        {'error': f'Booking with id {booking_id} does not exist'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            vehicle = Vehicle.createVehicle(
                vin=vin,
                make=make,
                model=model,
                weight=float(weight),
                booking=booking
            )

            serializer = self.get_serializer(vehicle)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def create_random_vehicle(self, request):
        try:
            booking_id = request.data.get('booking')

            booking = None
            if booking_id:
                try:
                    booking = Booking.objects.get(pk=booking_id)
                except Booking.DoesNotExist:
                    return Response(
                        {'error': f'Booking with id {booking_id} does not exist'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            vehicle = Vehicle.createVehicleRandom(booking=booking)

            serializer = self.get_serializer(vehicle)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_to_booking(self, request, pk=None):
        try:
            vehicle = self.get_object()
            booking_id = request.data.get('booking_id', 0)

            try:
                booking_id = int(booking_id)
            except (ValueError, TypeError):
                return Response(
                    {'error': 'Invalid booking ID'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            vehicle = vehicle.addVehicleToBooking(booking_id)
            serializer = self.get_serializer(vehicle)

            if booking_id == 0:
                message = "Vehicle successfully disassociated from booking"
            else:
                message = f"Vehicle successfully added to booking {vehicle.booking.booking_number}"

            return Response(
                {'message': message, 'vehicle': serializer.data},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        resource = VehicleResource()
        dataset = resource.export()
        response = HttpResponse(dataset.csv, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="vehicles.csv"'
        return response

    @action(detail=False, methods=['get'])
    def export_excel(self, request):
        resource = VehicleResource()
        dataset = resource.export()
        response = HttpResponse(dataset.xls, content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename="vehicles.xls"'
        return response