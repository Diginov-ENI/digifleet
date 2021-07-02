from django.db.models import query
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework import serializers
from rest_framework.decorators import permission_classes, action
from rest_framework.settings import api_settings
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from backend.models.model_vehicule import Vehicule
from backend.serializers import VehiculeSerializer
from backend.permissions.permission_vehicule import VehiculePermission

class VehiculeViewSet(viewsets.ViewSet):

    queryset = Vehicule.objects.all()
    permission_classes = (VehiculePermission,)

    def create(self, request):
        serializer = VehiculeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)    

    def update(self, request, pk=None, *args, **kwargs):
        queryset = Vehicule.objects.all()
        partial = kwargs.pop('partial', False)
        vehicule = get_object_or_404(queryset, pk=pk)
        serializer = VehiculeSerializer(vehicule, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def list(self, request):
        queryset = Vehicule.objects.all().order_by('id')
        serializer = VehiculeSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Vehicule.objects.all()
        vehicule = get_object_or_404(queryset, pk=pk)
        serializer = VehiculeSerializer(vehicule)
        self.check_object_permissions(request, vehicule)
        return Response(serializer.data)

    def destroy(self, request, pk=None, *args, **kwargs):
        queryset = Vehicule.objects.all()
        vehicule = get_object_or_404(queryset, pk=pk)
        vehicule.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        # TODO : Maybe some tests for exceptions here ? like a 404
        return self.update(request, *args, **kwargs)

    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}