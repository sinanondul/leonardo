from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from logistics.models import Vehicle


class Command(BaseCommand):
    help = 'Removes vehicles with booking ship arrival dates older than 6 months'

    def handle(self, *args, **options):
        six_months_ago = timezone.now() - timedelta(days=180)

        old_vehicles = Vehicle.objects.filter(
            booking__ship_arrival_date__lt=six_months_ago
        )

        count = old_vehicles.count()
        old_vehicles.delete()

        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {count} vehicles with bookings older than 6 months')
        )