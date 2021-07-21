from backend.permissions.permission_permission import PermissionPermission
from django.contrib.auth.models import Permission
from backend.permissions.permission_groupe import GroupPermission
from backend.serializers.serializer_utilisateur import GroupSerializer, PermissionSerializer
from django.core.exceptions import FieldError
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes, action
from rest_framework.settings import api_settings
from rest_framework.response import Response


# Create your views here.
class PermissionViewSet(viewsets.ViewSet):
    """
    Contient toutes les opération CRUD pour le modele Group
    les méthodes ci-dessous surchargent les méthodes de base du ViewSet pour 
    appliquer nos permissions personnalisées 
    """
    queryset = Permission.objects.all()
    permission_classes = (PermissionPermission,)
    
    def list(self, request):
        queryset = Permission.objects.all()
        serializer = PermissionSerializer(queryset, many=True)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        queryset = Permission.objects.all()
        permission = get_object_or_404(queryset, pk=pk)
        serializer = PermissionSerializer(permission)
        self.check_object_permissions(request, serializer)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)
    
    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}
