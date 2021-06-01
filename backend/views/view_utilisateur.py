from django.core.exceptions import NON_FIELD_ERRORS
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes, action
from django.core.exceptions import FieldError
from rest_framework.settings import api_settings
from rest_framework.response import Response
from backend.models.model_utilisateur import Utilisateur
from backend.serializers.serializer_utilisateur import UtilisateurSerializer
from backend.permissions.permission_utilisateur import UtilisateurPermission


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
            raise FieldError # TODO : add specific exception with message

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
        # TODO : Maybe some tests for exceptions here ? like a 404
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
