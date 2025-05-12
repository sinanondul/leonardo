from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'bookings', views.BookingViewSet)
router.register(r'vehicles', views.VehicleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
