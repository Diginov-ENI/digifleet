from django.core.exceptions import NON_FIELD_ERRORS
from django.db.models.fields import EmailField
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status, generics
from rest_framework.decorators import permission_classes, action
from rest_framework.settings import api_settings
from rest_framework.response import Response
from backend.models.model_emprunt import Emprunt
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
    queryset = Utilisateur.objects.all().order_by('id')
    permission_classes = (UtilisateurPermission,)
    
    def list(self, request):
        queryset = Utilisateur.objects.exclude(is_superuser=True).order_by('id')
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
            return Response(data= { 'IsSuccess': False, 'LibErreur' : "Un compte existe déjà avec l'adresse E-Mail \"" + serializer.validated_data['email'] + "\"."}, status=status.HTTP_200_OK)

        u = serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, pk=None, *args, **kwargs):
        queryset = Utilisateur.objects.all()
        partial = kwargs.pop('partial', False)
        user = get_object_or_404(queryset, pk=pk)
        context = {'request': self.request}
        
        self.check_object_permissions(request, user)
        serializer = UtilisateurSerializer(user, data=request.data, partial=partial,context=context)
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

        if Emprunt.objects.filter(conducteur_id=user.id).exists() or Emprunt.objects.filter(passagers__id__contains=user.id).exists():
            return Response(data= { 'IsSuccess': False, 'LibErreur' : "Impossible de supprimer cet utilisateur car il est lié à un emprunt (privilégier l'archivage)"}, status=status.HTTP_200_OK)

        user.delete()
        return Response(data= { 'IsSuccess': True, 'Data': True }, status=status.HTTP_200_OK)

    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}

class ChangePasswordView(generics.UpdateAPIView):

    queryset = Utilisateur.objects.all()
    serializer_class = ChangePasswordSerializer
    permission_classes = (UtilisateurPasswordPermission,)
    #def filter_queryset(self, queryset):
           # queryset = queryset.filter(pk=self.request.user.id)
           #Todo filter connected user, perm ?
