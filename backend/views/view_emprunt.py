from django.core.exceptions import NON_FIELD_ERRORS
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes, action
from rest_framework.settings import api_settings
from rest_framework.response import Response
from backend.models.model_emprunt import Emprunt
from backend.serializers.serializer_emprunt import EmpruntSerializer
from backend.permissions.permission_emprunt import EmpruntPermission
from rest_framework.reverse import reverse
from django.db.models import Q, query

class EmpruntViewSet(viewsets.ViewSet):
    """
    Contient toutes les opération CRUD pour le modele Emprunt
    les méthodes ci-dessous surchargent les méthodes de base du ViewSet pour 
    appliquer nos permissions personnalisées 
    """
    queryset = Emprunt.objects.all()
    permission_classes = (EmpruntPermission,)
    
    def list(self, request):
        params = request.query_params
        queryset = Emprunt.objects.all().order_by('-date_debut')
        if 'dateDebut' in params:
            queryset = queryset.filter(Q(date_debut__gte=params['dateDebut']))
        if 'dateFin' in params:
            queryset = queryset.filter(Q(date_fin__lte=params['dateFin']))
        if 'siteId' in params:
            queryset = queryset.filter(site_id=params['siteId'])
        if 'isCloturee' in params and params['isCloturee'] == 'true':
            queryset = queryset.filter(statut='CLOTUREE')
        else:
            queryset = queryset.exclude(statut='CLOTUREE')
        
        serializer = EmpruntSerializer(queryset, many=True)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    @action(detail=False, url_path='list-by-owner', url_name='list_by_owner')
    def list_by_owner(self, request):
        params = request.query_params
        queryset = Emprunt.objects.filter(conducteur_id=params['id']).order_by('-date_debut')
        if 'dateDebut' in params:
            queryset = queryset.filter(Q(date_debut__gte=params['dateDebut']))
        if 'dateFin' in params:
            queryset = queryset.filter(Q(date_fin__lte=params['dateFin']))
        if 'siteId' in params:
            queryset = queryset.filter(site_id=params['siteId'])
        if 'isCloturee' in params and params['isCloturee'] == 'true':
            queryset = queryset.filter(statut='CLOTUREE')
        else:
            queryset = queryset.exclude(statut='CLOTUREE')
        
        serializer = EmpruntSerializer(queryset, many=True)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        queryset = Emprunt.objects.all()
        emprunt = get_object_or_404(queryset, pk=pk)
        serializer = EmpruntSerializer(emprunt)
        self.check_object_permissions(request, emprunt)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = EmpruntSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save()
        except Exception as e:
            return Response(data= { 'IsSuccess': False, 'LibErreur' : str(e)}, status=status.HTTP_200_OK)
        headers = self.get_success_headers(serializer.data)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, pk=None, *args, **kwargs):
        queryset = Emprunt.objects.all()
        partial = kwargs.pop('partial', False)
        emprunt = get_object_or_404(queryset, pk=pk)
        serializer = EmpruntSerializer(emprunt, data=request.data, partial=partial)
        self.check_object_permissions(request, emprunt)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save()
        except Exception as e:
            return Response(data= { 'IsSuccess': False, 'LibErreur' : str(e)}, status=status.HTTP_200_OK)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        # TODO : Maybe some tests for exceptions here ? like a 404
        return self.update(request, *args, **kwargs)

    def destroy(self, request, pk=None, *args, **kwargs):
        queryset = Emprunt.objects.all()
        emprunt = get_object_or_404(queryset, pk=pk)
        self.check_object_permissions(request, emprunt)
        emprunt.delete()
        return Response(data= { 'IsSuccess': True, 'Data': True }, status=status.HTTP_200_OK)

    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}