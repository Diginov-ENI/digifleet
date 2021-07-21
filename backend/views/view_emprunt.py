from django.core.exceptions import NON_FIELD_ERRORS
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes, action
from rest_framework.settings import api_settings
from rest_framework.response import Response
from backend.models.model_emprunt import Emprunt
from backend.serializers.serializer_emprunt import EmpruntSerializer
from backend.permissions.permission_emprunt import EmpruntPermission


class EmpruntViewSet(viewsets.ViewSet):
    """
    Contient toutes les opération CRUD pour le modele Emprunt
    les méthodes ci-dessous surchargent les méthodes de base du ViewSet pour 
    appliquer nos permissions personnalisées 
    """
    queryset = Emprunt.objects.all()
    permission_classes = (EmpruntPermission,)
    
    def list(self, request):
        queryset = Emprunt.objects.all().order_by('-date_debut').exclude(statut='CLOTUREE')
        serializer = EmpruntSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, url_path='list-by-owner')
    def list_by_owner(self, request, pk=None):
        queryset = Emprunt.objects.filter(conducteur_id=pk).order_by('-date_debut')
        serializer = EmpruntSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Emprunt.objects.all()
        emprunt = get_object_or_404(queryset, pk=pk)
        serializer = EmpruntSerializer(emprunt)
        self.check_object_permissions(request, emprunt)
        return Response(serializer.data)

    def create(self, request):
        serializer = EmpruntSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)    

    def update(self, request, pk=None, *args, **kwargs):
        queryset = Emprunt.objects.all()
        partial = kwargs.pop('partial', False)
        emprunt = get_object_or_404(queryset, pk=pk)
        serializer = EmpruntSerializer(emprunt, data=request.data, partial=partial)
        self.check_object_permissions(request, emprunt)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        # TODO : Maybe some tests for exceptions here ? like a 404
        return self.update(request, *args, **kwargs)

    def destroy(self, request, pk=None, *args, **kwargs):
        queryset = Emprunt.objects.all()
        emprunt = get_object_or_404(queryset, pk=pk)
        self.check_object_permissions(request, emprunt)
        emprunt.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}