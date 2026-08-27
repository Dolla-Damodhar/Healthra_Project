from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Appointment, Customer
from .serializers import AppointmentSerializer, LoginSerializer

ACCESS_COOKIE = 'access_token'
REFRESH_COOKIE = 'refresh_token'

# Same-site deployment (frontend + backend behind one nginx host) means
# SameSite=Lax is enough; secure=True requires HTTPS, which is why it's
# tied to DEBUG rather than hardcoded.
COOKIE_KWARGS = {
    'httponly': True,
    'secure': not settings.DEBUG,
    'samesite': 'Lax',
    'path': '/api/',
}


def _set_auth_cookies(response, customer):
    refresh = RefreshToken.for_user(customer)
    response.set_cookie(ACCESS_COOKIE, str(refresh.access_token), **COOKIE_KWARGS)
    response.set_cookie(REFRESH_COOKIE, str(refresh), **COOKIE_KWARGS)


def _clear_auth_cookies(response):
    response.delete_cookie(ACCESS_COOKIE, path='/api/')
    response.delete_cookie(REFRESH_COOKIE, path='/api/')


@method_decorator(ensure_csrf_cookie, name='post')
class LoginView(APIView):
    """
    Combined login/signup. If the email has no account yet, one is created
    with the submitted password (no confirm-password step, no separate
    signup screen — by design). Issues JWT access/refresh tokens as httpOnly
    cookies (not in the response body) and hands the frontend a csrftoken
    cookie to echo back on future mutating requests.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].strip().lower()
        password = serializer.validated_data['password']

        try:
            customer = Customer.objects.get(email=email)
        except Customer.DoesNotExist:
            customer = Customer.objects.create_user(email=email, password=password)
        else:
            if not customer.check_password(password):
                return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        response = Response({'email': customer.email, 'name': customer.name})
        _set_auth_cookies(response, customer)
        return response


class LogoutView(APIView):
    """Clears the auth cookies server-side — JS can't do this since they're httpOnly."""
    # permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        _clear_auth_cookies(response)
        return response


@method_decorator(ensure_csrf_cookie, name='get')
class MeView(APIView):
    """
    Hydrates frontend auth state on page load/refresh (the frontend can't
    read the httpOnly cookie itself to know if it's logged in), and
    guarantees a csrftoken cookie exists for any page that loads first.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'email': request.user.email, 'name': request.user.name})


class RefreshView(APIView):
    """Cookie-based replacement for simplejwt's TokenRefreshView."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        raw_refresh = request.COOKIES.get(REFRESH_COOKIE)
        if not raw_refresh:
            return Response({'detail': 'No refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(raw_refresh)
            access = refresh.access_token
        except TokenError:
            return Response({'detail': 'Invalid or expired refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)

        response = Response(status=status.HTTP_200_OK)
        response.set_cookie(ACCESS_COOKIE, str(access), **COOKIE_KWARGS)
        return response


class AppointmentViewSet(viewsets.ModelViewSet):
    """
    Scoped to the authenticated customer — each user only sees/creates their
    own bookings.
    """
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'department', 'doctor', 'date']

    def get_queryset(self):
        return Appointment.objects.filter(customer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
