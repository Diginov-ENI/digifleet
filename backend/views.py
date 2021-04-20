from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404


# Create your views here.
from rest_framework import status, viewsets
from rest_framework.response import Response

from backend.models.Vehicule import Vehicule
from backend.serializers import VehiculeSerializer


class VehiculeViewSet(viewsets.ViewSet):

    def create(self, request):
        serializer = VehiculeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)    

    def update(self, request, pk=None, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        vehicule = get_object_or_404(self.queryset, pk=pk)
        serializer = VehiculeSerializer(vehicule, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)