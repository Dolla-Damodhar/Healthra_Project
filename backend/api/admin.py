from django.contrib import admin

from .models import Appointment, Customer


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient_name', 'doctor', 'department', 'date', 'time_slot', 'status']
    list_filter = ['status', 'department', 'date']
    search_fields = ['patient_name', 'patient_email', 'patient_phone', 'doctor']


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'phone', 'created_at']
    search_fields = ['email', 'name', 'phone']
