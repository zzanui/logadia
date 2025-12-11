# myapp/middleware.py
import logging
access_logger = logging.getLogger("access")

class AccessLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        params = request.GET.dict() if request.method == "GET" else request.POST.dict()

        access_logger.info(
            f"{request.method} {request.path} "
            f"status={response.status_code} "
            f"user={'anon' if not request.user.is_authenticated else request.user} "
            f"ip={request.META.get('REMOTE_ADDR')} "
            f"params={params}"
        )
        return response
