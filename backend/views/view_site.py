from backend.permissions.permission_site import SitePermission
from django.core.exceptions import FieldError
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes, action
from rest_framework.settings import api_settings
from rest_framework.response import Response
from backend.models.model_site import Site
from backend.serializers.serializer_site import SiteSerializer
from backend.permissions.permission_site import SitePermission


# Create your views here.
class SiteViewSet(viewsets.ViewSet):
    """
    Contient toutes les opération CRUD pour le modele Site
    les méthodes ci-dessous surchargent les méthodes de base du ViewSet pour 
    appliquer nos permissions personnalisées 
    """
    queryset = Site.objects.all()
    permission_classes = (SitePermission,)
    
    def list(self, request):
        queryset = Site.objects.all()
        serializer = SiteSerializer(queryset, many=True)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        queryset = Site.objects.all()
        site = get_object_or_404(queryset, pk=pk)
        serializer = SiteSerializer(site)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = SiteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if Site.objects.filter(libelle__exact=serializer.validated_data['libelle']):
            return Response(data= { 'IsSuccess': False, 'LibErreur' : "Un site existe déjà avec le libellé \"" + serializer.validated_data['libelle'] + "\"."}, status=status.HTTP_200_OK)

        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, pk=None, *args, **kwargs):
        queryset = Site.objects.all()
        partial = kwargs.pop('partial', False)
        site = get_object_or_404(queryset, pk=pk)
        serializer = SiteSerializer(site, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None, *args, **kwargs):
        queryset = Site.objects.all()
        site = get_object_or_404(queryset, pk=pk)
        site.delete()
        return Response(data= { 'IsSuccess': True, 'Data': True }, status=status.HTTP_200_OK)
    
    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}
