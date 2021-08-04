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
class PermissionTypeViewSet(viewsets.ViewSet):
    """
    Contient toutes les opération CRUD pour le modele Group
    les méthodes ci-dessous surchargent les méthodes de base du ViewSet pour 
    appliquer nos permissions personnalisées 
    """
    queryset = ContentType.objects.all()
    permission_classes = (PermissionTypePermission,)
    
    def list(self, request):
        queryset = ContentType.objects.all()
        serializer = PermissionTypeSerializer(queryset, many=True)
        types = []
        for t in serializer.data:
            if len(t['Permissions']) > 0:
                types.append(t)

        return Response(types)

    def retrieve(self, request, pk=None):
        queryset = ContentType.objects.all()
        permissiontype = get_object_or_404(queryset, pk=pk)
        serializer = PermissionTypeSerializer(permissiontype)
        self.check_object_permissions(request, serializer)
        return Response(serializer.data)
    
    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}
