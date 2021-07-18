from django.core.exceptions import NON_FIELD_ERRORS
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status, generics
from rest_framework.decorators import permission_classes, action
from django.core.exceptions import FieldError
from rest_framework.settings import api_settings
from rest_framework.response import Response

from backend.models.model_vehicule import Vehicule
from backend.serializers import VehiculeSerializer

from backend.models.model_utilisateur import Utilisateur
from backend.serializers.serializer_utilisateur import UtilisateurSerializer
from backend.permissions.permission_utilisateur import UtilisateurPermission

from backend.serializers.serializer_utilisateur import ChangePasswordSerializer
from backend.permissions.permission_utilisateur import UtilisateurPasswordPermission, UtilisateurPermission
from django.contrib.auth.models import update_last_login

# Create your views here.
class UtilisateurViewSet(viewsets.ViewSet):
    """
    Contient toutes les opération CRUD pour le modele Utilisateur
    les méthodes ci-dessous surchargent les méthodes de base du ViewSet pour 
    appliquer nos permissions personnalisées 
    """
    queryset = Utilisateur.objects.all()
    permission_classes = (UtilisateurPermission,)
    
    def list(self, request):
        queryset = Utilisateur.objects.all()
        serializer = UtilisateurSerializer(queryset, many=True)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        queryset = Utilisateur.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UtilisateurSerializer(user)
        self.check_object_permissions(request, user)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = UtilisateurSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if Utilisateur.objects.filter(email__exact=serializer.validated_data['email']):
            return Response(data= { 'IsSuccess': False, 'LibErreur' : "Un compte existe déjà avec l'adresse E-Mail \"" + serializer.validated_data['email'] + "\""}, status=status.HTTP_200_OK)

        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_201_CREATED, headers=headers)    

    def update(self, request, pk=None, *args, **kwargs):
        queryset = Utilisateur.objects.all()
        partial = kwargs.pop('partial', False)
        user = get_object_or_404(queryset, pk=pk)
        serializer = UtilisateurSerializer(user, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        # TODO : Maybe some tests for exceptions here ? like a 404
        return self.update(request, *args, **kwargs)

    def destroy(self, request, pk=None, *args, **kwargs):
        queryset = Utilisateur.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        user.delete()
        return Response(data= { 'IsSuccess': True, 'Data': True }, status=status.HTTP_204_NO_CONTENT)
    
    # TODO - à faire fonctionner ou le "partial_update" suffit ?
    """
    @action(detail=False)
    def archive(self, request, pk=None *args, **kwargs):
        queryset = Utilisateur.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UtilisateurSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    """

    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}

class VehiculeViewSet(viewsets.ViewSet):

    queryset = Vehicule.objects.all()
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

    def list(self, request):
        queryset = Vehicule.objects.all()
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
class ChangePasswordView(generics.UpdateAPIView):

    queryset = Utilisateur.objects.all()
    serializer_class = ChangePasswordSerializer
    permission_classes = (UtilisateurPasswordPermission,)
    #def filter_queryset(self, queryset):
           # queryset = queryset.filter(pk=self.request.user.id)
           #Todo filter connected user, perm ?
