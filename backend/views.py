from django.db.models import query
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, mixins, status
from rest_framework.decorators import permission_classes, action
from rest_framework.settings import api_settings
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from backend.models import Utilisateur
from backend.serializers import UtilisateurSerializer
from backend.permissions import UtilisateurPermission


# Create your views here.
class UtilisateurViewSet(viewsets.ViewSet):
    queryset = Utilisateur.objects.all()
    permission_classes = (UtilisateurPermission,)
    
    def list(self, request):
        serializer = UtilisateurSerializer(self.queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        user = get_object_or_404(self.queryset, pk=pk)
        serializer = UtilisateurSerializer(user)
        self.check_object_permissions(request, user)
        return Response(serializer.data)

    def create(self, request):
        # TODO
        serializer = UtilisateurSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)    

    def update(self, request, pk=None):
        # TODO
        pass

    def partial_update(self, request, pk=None):
        # TODO
        pass

    def destroy(self, request, pk=None):
        # TODO
        pass
    
    # TODO : finish it
    @action(detail=False)
    def archive(self, request, pk=None):
        #TODO
        pass



    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}