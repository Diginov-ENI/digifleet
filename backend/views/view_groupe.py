from backend.models.model_utilisateur import Utilisateur
from backend.permissions.permission_groupe import GroupPermission
from backend.serializers.serializer_group import GroupSerializer
from django.core.exceptions import FieldError
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes, action
from rest_framework.settings import api_settings
from rest_framework.response import Response
from django.contrib.auth.models import Group


# Create your views here.
class GroupeViewSet(viewsets.ViewSet):
    """
    Contient toutes les opération CRUD pour le modele Group
    les méthodes ci-dessous surchargent les méthodes de base du ViewSet pour 
    appliquer nos permissions personnalisées 
    """
    queryset = Group.objects.all().order_by('id')
    permission_classes = (GroupPermission,)
    
    def list(self, request):
        queryset = Group.objects.all().order_by('id')
        serializer = GroupSerializer(queryset, many=True)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        queryset = Group.objects.all()
        groupe = get_object_or_404(queryset, pk=pk)
        serializer = GroupSerializer(groupe)
        self.check_object_permissions(request, groupe)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = GroupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if Group.objects.filter(name__exact=serializer.validated_data['name']):
            return Response(data= { 'IsSuccess': False, 'LibErreur' : "Un groupe existe déjà avec le nom \"" + serializer.validated_data['name'] + "\"."}, status=status.HTTP_200_OK)

        serializer.save()

        if "Utilisateurs" in request.data.keys():
            for utilisateur in request.data["Utilisateurs"]:
                if(utilisateur['Id'] != request.user.id):
                    userQuery = Utilisateur.objects.get(id=utilisateur['Id'])
                    userQuery.groups.add(serializer.data['Id'])
                    userQuery.save()


        headers = self.get_success_headers(serializer.data)
        return Response(data= { 'IsSuccess': True, 'Data': serializer.data }, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, pk=None, *args, **kwargs):
        queryset = Group.objects.all()
        partial = kwargs.pop('partial', False)
        group = get_object_or_404(queryset, pk=pk)
        
        self.check_object_permissions(request, group)
        serializer = GroupSerializer(group, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if "Utilisateurs" in request.data.keys():
            users_id = []

            # On ajout les utilisateurs
            for utilisateur in request.data["Utilisateurs"]:
                if(utilisateur['Id'] != request.user.id):
                    users_id.append(utilisateur['Id'])
                    userQuery = Utilisateur.objects.get(id=utilisateur['Id'])
                    userQuery.groups.add(serializer.data['Id'])
                    userQuery.save()

            # On retire les utilisateur
            users_to_remove = Utilisateur.objects.filter(groups__id=serializer.data['Id']).exclude(id__in=users_id)
            for utilisateur in users_to_remove:
                utilisateur.groups.remove(serializer.data['Id'])
                utilisateur.save()

        group = Group.objects.get(id=serializer.data['Id'])
        groupSeril = GroupSerializer(group)
        return Response(data= { 'IsSuccess': True, 'Data': groupSeril.data }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, pk=None, *args, **kwargs):
        queryset = Group.objects.all()
        group = get_object_or_404(queryset, pk=pk)
        self.check_object_permissions(request, group)
        group.delete()
        return Response(data= { 'IsSuccess': True, 'Data': True }, status=status.HTTP_200_OK)
    
    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}
