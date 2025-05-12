from django.apps import AppConfig


class LogisticsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'logistics'
    verbose_name = 'Vehicle Logistics'

    def ready(self):
        """
        Perform initialization tasks when the app is ready.
        """
        pass  # Can be used for signal registration or other setup