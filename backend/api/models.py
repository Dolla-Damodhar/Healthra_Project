from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models


class CustomerManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class Customer(AbstractBaseUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomerManager()

    def __str__(self):
        return self.email


class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        CANCELLED = 'cancelled', 'Cancelled'
        COMPLETED = 'completed', 'Completed'

    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name='appointments',
        null=True, blank=True,
    )
    department = models.CharField(max_length=100)
    doctor = models.CharField(max_length=150)
    date = models.DateField()
    time_slot = models.CharField(max_length=20)

    patient_name = models.CharField(max_length=150)
    patient_phone = models.CharField(max_length=20)
    patient_email = models.EmailField()
    reason = models.TextField(blank=True)

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['patient_email', '-created_at']),
        ]

    def __str__(self):
        return f'{self.patient_name} -> {self.doctor} on {self.date} {self.time_slot}'
