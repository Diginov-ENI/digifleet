from django.core.exceptions import FieldError
from django.db.models import query
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status, generics
from rest_framework import serializers
from rest_framework.decorators import permission_classes, action
from rest_framework.fields import EmailField
from rest_framework.settings import api_settings
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from backend.models import Utilisateur
from backend.serializers import UtilisateurSerializer
from backend.serializers import ChangePasswordSerializer
from backend.permissions import UtilisateurPasswordPermission, UtilisateurPermission

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
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Utilisateur.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UtilisateurSerializer(user)
        self.check_object_permissions(request, user)
        return Response(serializer.data)

    def create(self, request):
        serializer = UtilisateurSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if Utilisateur.objects.filter(email__exact=serializer.validated_data['email']):
            raise FieldError

        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)    

    def update(self, request, pk=None, *args, **kwargs):
        queryset = Utilisateur.objects.all()
        partial = kwargs.pop('partial', False)
        user = get_object_or_404(queryset, pk=pk)
        serializer = UtilisateurSerializer(user, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, pk=None, *args, **kwargs):
        queryset = Utilisateur.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
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




class ChangePasswordView(generics.UpdateAPIView):

    queryset = Utilisateur.objects.all()
    serializer_class = ChangePasswordSerializer
    permission_classes = (UtilisateurPasswordPermission,)
    #def filter_queryset(self, queryset):
           # queryset = queryset.filter(pk=self.request.user.id)
           #Todo filter connected user, perm ?