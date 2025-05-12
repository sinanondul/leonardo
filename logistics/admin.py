# logistics/admin.py
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Booking, Vehicle
from .resources import BookingResource, VehicleResource


class VehicleInline(admin.TabularInline):
    model = Vehicle
    extra = 1
    fields = ('vin', 'make', 'model', 'weight')


@admin.register(Booking)
class BookingAdmin(ImportExportModelAdmin):
    resource_class = BookingResource
    list_display = ('booking_number', 'loading_port', 'discharge_port',
                    'ship_departure_date', 'ship_arrival_date', 'get_vehicle_count')
    search_fields = ('booking_number', 'loading_port', 'discharge_port')
    list_filter = ('loading_port', 'discharge_port')
    inlines = [VehicleInline]

    def get_vehicle_count(self, obj):
        return obj.vehicles.count()

    get_vehicle_count.short_description = 'Vehicles'


@admin.register(Vehicle)
class VehicleAdmin(ImportExportModelAdmin):
    resource_class = VehicleResource
    list_display = ('vin', 'make', 'model', 'weight', 'booking')
    search_fields = ('vin', 'make', 'model')
    list_filter = ('make', 'booking')