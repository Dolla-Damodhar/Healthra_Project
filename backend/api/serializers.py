from rest_framework import serializers

from .models import Appointment, Customer


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'id', 'department', 'doctor', 'date', 'time_slot',
            'patient_name', 'patient_phone', 'patient_email', 'reason',
            'status', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']

    def validate(self, attrs):
        doctor = attrs.get('doctor')
        date = attrs.get('date')
        time_slot = attrs.get('time_slot')

        if doctor and date and time_slot:
            clash = Appointment.objects.filter(
                doctor=doctor, date=date, time_slot=time_slot,
                status__in=[Appointment.Status.PENDING, Appointment.Status.CONFIRMED],
            )
            if clash.exists():
                raise serializers.ValidationError(
                    {'time_slot': 'This slot is already booked for the selected doctor.'}
                )
        return attrs
