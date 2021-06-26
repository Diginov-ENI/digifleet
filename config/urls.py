"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from backend.serializers.serializer_utilisateur import CustomJWTSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.urls import path, include
from rest_framework import routers
from backend import views
from backend.views.view_utilisateur import ChangePasswordView

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'utilisateurs', views.UtilisateurViewSet)
router.register(r'vehicules', views.VehiculeViewSet)
router.register(r'sites', views.SiteViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/auth/login/', TokenObtainPairView.as_view(serializer_class=CustomJWTSerializer),name="jwt_login"),
    path('api/auth/refresh-token/', TokenRefreshView.as_view(),name="jwt_refresh"),
    path('api/change-password/<int:pk>/', ChangePasswordView.as_view(), name='auth_change_password'),

]
