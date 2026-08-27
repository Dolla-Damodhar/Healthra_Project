from django.middleware.csrf import CsrfViewMiddleware
from rest_framework import exceptions
from rest_framework_simplejwt.authentication import JWTAuthentication

ACCESS_COOKIE = 'access_token'


class CookieJWTAuthentication(JWTAuthentication):
    """
    Reads the JWT access token from an httpOnly cookie instead of the
    Authorization header. Cookie-based auth is sent automatically by the
    browser (unlike a header), so it's vulnerable to CSRF unless we check
    it ourselves — DRF's APIView bypasses Django's CsrfViewMiddleware by
    default, so that check has to happen here.
    """

    def authenticate(self, request):
        raw_token = request.COOKIES.get(ACCESS_COOKIE)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        self._enforce_csrf(request)
        return self.get_user(validated_token), validated_token

    def _enforce_csrf(self, request):
        check = CsrfViewMiddleware(lambda r: None)
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied(f'CSRF Failed: {reason}')
