from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AppointmentViewSet, LoginView, LogoutView, MeView, RefreshView

appointment_router = DefaultRouter()
appointment_router.register('', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/refresh/', RefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('appointments/', include(appointment_router.urls)),
]
