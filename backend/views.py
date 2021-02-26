from django.db.models import query
from rest_framework import viewsets, permissions, serializers, mixins
from rest_framework.decorators import permission_classes, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.serializers import Serializer
from backend.models import Utilisateur, utilisateur
from backend.serializers import UtilisateurSerializer
from backend.permissions import UtilisateurPermission
from django.shortcuts import render

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
        pass

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