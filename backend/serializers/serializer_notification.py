
from backend.serializers.serializer_emprunt import EmpruntSerializer
from django.shortcuts import get_object_or_404
from backend.serializers.serializer_permission import PermissionSerializer
from django.contrib.auth.models import Permission,Group
from rest_framework import serializers
from backend.models.model_utilisateur import Utilisateur
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class NotificationSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id', required=False)
    Message = serializers.CharField(source='message')
    Emprunt = EmpruntSerializer(source='emprunt', many=False, required=False)
    class Meta:
        model = Group
        fields = ('Id','Message','Emprunt')


