from re import I
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.settings import api_settings
from rest_framework.response import Response
from backend.models.model_emprunt import Emprunt
from backend.models.model_vehicule import Vehicule
from backend.serializers import VehiculeSerializer
from backend.permissions.permission_vehicule import VehiculePermission
from django.db.models import Q, query 

class VehiculeViewSet(viewsets.ViewSet):

    queryset = Vehicule.objects.all()
    permission_classes = (VehiculePermission,)

    def create(self, request):
        serializer = VehiculeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)        
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, pk=None, *args, **kwargs):
        queryset = Vehicule.objects.all()
        partial = kwargs.pop('partial', False)
        vehicule = get_object_or_404(queryset, pk=pk)
        serializer = VehiculeSerializer(vehicule, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def list(self, request):
        queryset = Vehicule.objects.all().order_by('id')
        serializer = VehiculeSerializer(queryset, many=True)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    @action(detail=False, url_path='availables', url_name='list_availables')
    def list_availables(self, request):
        """
        On récupère la liste de tous les véhicules disponibles avec le même site
        """
        params = request.query_params
        queryset = Vehicule.objects.exclude(is_active=False
        ).filter(
            Q(site_id=params['siteId']),
        ).exclude(
            Q(emprunts__date_debut__lte=params['dateFin']),
            Q(emprunts__date_fin__gte=params['dateDebut']),
            Q(emprunts__statut__in=['EN_COURS', 'ATTENTE_CLEF'])
        ).order_by('id')        

        serializer = VehiculeSerializer(queryset, many=True)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        queryset = Vehicule.objects.all()
        vehicule = get_object_or_404(queryset, pk=pk)
        serializer = VehiculeSerializer(vehicule)
        self.check_object_permissions(request, vehicule)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None, *args, **kwargs):
        queryset = Vehicule.objects.all()
        vehicule = get_object_or_404(queryset, pk=pk)

        if Emprunt.objects.filter(vehicule_id=vehicule.id).exists() :
            return Response(data= { 'IsSuccess': False, 'LibErreur' : "Impossible de supprimer ce véhicule car il est lié à un emprunt (privilégier l'archivage)"}, status=status.HTTP_200_OK)

        vehicule.delete()
        return Response(data= { 'IsSuccess': True, 'Data': True }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        # TODO : Maybe some tests for exceptions here ? like a 404
        return self.update(request, *args, **kwargs)

    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}