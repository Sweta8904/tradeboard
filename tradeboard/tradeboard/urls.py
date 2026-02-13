from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


# 👇 Root test endpoint
def home(request):
    return JsonResponse({
        "message": "TradeBoard API is running 🚀",
        "available_endpoints": [
            "/admin/",
            "/api/"
        ]
    })


urlpatterns = [
    path("", home),  # 👈 Added root URL
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),
]
