from import_export import resources
from import_export.fields import Field
from .models import Booking, Vehicle


class BookingResource(resources.ModelResource):
    class Meta:
        model = Booking
        fields = ('id', 'booking_number', 'loading_port', 'discharge_port',
                  'ship_arrival_date', 'ship_departure_date')
        export_order = fields


class VehicleResource(resources.ModelResource):
    booking_number = Field(attribute='booking__booking_number', column_name='booking_number')

    class Meta:
        model = Vehicle
        fields = ('id', 'vin', 'make', 'model', 'weight', 'booking_number')
        export_order = fields