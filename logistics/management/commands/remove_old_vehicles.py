from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from logistics.models import Vehicle
from logistics.app_settings import OLD_VEHICLES_DAYS


class Command(BaseCommand):
    help = f'Removes vehicles with booking ship arrival dates older than {OLD_VEHICLES_DAYS} days'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=OLD_VEHICLES_DAYS,
            help=f'Number of days to consider (default: {OLD_VEHICLES_DAYS} days)'
        )

    def handle(self, *args, **options):
        days = options['days']
        cutoff_date = timezone.now() - timedelta(days=days)

        self.stdout.write(f'Removing vehicles with bookings older than {days} days...')

        old_vehicles = Vehicle.objects.filter(
            booking__ship_arrival_date__lt=cutoff_date
        )

        count = old_vehicles.count()

        if count > 0:
            old_vehicles.delete()
            self.stdout.write(
                self.style.SUCCESS(f'Successfully deleted {count} vehicles with bookings older than {days} days')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f'No vehicles found with bookings older than {days} days')
            )