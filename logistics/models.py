from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
import random
import string


class Booking(models.Model):
    booking_number = models.CharField(
        max_length=50,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[A-Za-z0-9-]+$',
                message='Booking number must be alphanumeric',
            ),
        ]
    )
    loading_port = models.CharField(max_length=100)
    discharge_port = models.CharField(max_length=100)
    ship_arrival_date = models.DateTimeField()
    ship_departure_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking {self.booking_number}"

    def clean(self):
        # Validate departure date is before arrival date
        if self.ship_departure_date and self.ship_arrival_date and self.ship_departure_date > self.ship_arrival_date:
            raise ValidationError("Ship departure date must be before arrival date")

    def addVehicleToBooking(self, vehicle):
        """
        Associate a vehicle with this booking.
        """
        vehicle.booking = self
        vehicle.save()
        return vehicle


class Vehicle(models.Model):
    vin = models.CharField(
        max_length=17,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[A-HJ-NPR-Z0-9]{17}$',
                message='VIN must be a valid 17-character Vehicle Identification Number',
            ),
        ],
        verbose_name="VIN"
    )
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    weight = models.DecimalField(max_digits=8, decimal_places=2, help_text="Weight in kilograms")
    booking = models.ForeignKey(
        Booking,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='vehicles'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.make} {self.model} ({self.vin})"

    @classmethod
    def createVehicle(cls, vin, make, model, weight, booking=None):
        """
        Create a vehicle with specific values
        """
        vehicle = cls(
            vin=vin,
            make=make,
            model=model,
            weight=weight,
            booking=booking
        )
        vehicle.full_clean()
        vehicle.save()
        return vehicle

    @classmethod
    def createVehicleRandom(cls, booking=None):
        """
        Create a vehicle with random VIN and default values
        """
        # Generate a valid random VIN (17 characters)
        valid_chars = string.digits + ''.join([c for c in string.ascii_uppercase if c not in 'IOQ'])
        random_vin = ''.join(random.choice(valid_chars) for _ in range(17))

        # Default values
        default_make = "Default Make"
        default_model = "Default Model"
        default_weight = 1500.00

        vehicle = cls(
            vin=random_vin,
            make=default_make,
            model=default_model,
            weight=default_weight,
            booking=booking
        )
        vehicle.save()
        return vehicle

    def addVehicleToBooking(self, booking_id):
        """
        Associate this vehicle with a booking.
        If booking_id is 0, disassociate the vehicle from any booking.
        """
        if booking_id == 0:
            self.booking = None
        else:
            try:
                booking = Booking.objects.get(pk=booking_id)
                self.booking = booking
            except Booking.DoesNotExist:
                raise ValueError(f"Booking with id {booking_id} does not exist")

        self.save()
        return self