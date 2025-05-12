from django import template
from logistics.models import Booking, Vehicle
from logistics.app_settings import OLD_VEHICLES_DAYS
from django.utils import timezone
from datetime import timedelta

register = template.Library()

@register.simple_tag
def get_bookings():
    """Return all bookings ordered by departure date"""
    return Booking.objects.all().order_by('ship_departure_date')

@register.simple_tag
def get_vehicles(booking_id=None):
    """Return vehicles, optionally filtered by booking"""
    if booking_id:
        return Vehicle.objects.filter(booking_id=booking_id)
    return Vehicle.objects.all()

@register.simple_tag
def get_vehicle_count(booking_id=None):
    """Return the count of vehicles, optionally for a specific booking"""
    if booking_id:
        return Vehicle.objects.filter(booking_id=booking_id).count()
    return Vehicle.objects.count()

@register.simple_tag
def get_old_vehicles():
    """Return vehicles with bookings older than the configured threshold"""
    cutoff_date = timezone.now() - timedelta(days=OLD_VEHICLES_DAYS)
    return Vehicle.objects.filter(booking__ship_arrival_date__lt=cutoff_date)
