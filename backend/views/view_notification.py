from backend.serializers.serializer_notification import NotificationSerializer
from backend.models.model_notification import Notification
from backend.permissions.permission_permission_type import PermissionTypePermission
from backend.serializers.serializer_permission_type import PermissionTypeSerializer
from django.contrib.auth.models import ContentType
from backend.permissions.permission_groupe import GroupPermission
from backend.serializers.serializer_utilisateur import GroupSerializer, PermissionSerializer
from django.core.exceptions import FieldError
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes, action
from rest_framework.settings import api_settings
from rest_framework.response import Response

# Create your views here.
class NotificationViewSet(viewsets.ViewSet):
    
    queryset = ContentType.objects.all()
    
    def list(self, request):
        queryset = Notification.objects.all()
        serializer = NotificationSerializer(queryset, many=True)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

   
    
    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}
