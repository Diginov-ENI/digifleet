
from backend.serializers.serializer_emprunt import EmpruntSerializer
from django.shortcuts import get_object_or_404
from backend.serializers.serializer_permission import PermissionSerializer
from django.contrib.auth.models import Permission,Group
from rest_framework import serializers
from backend.models.model_utilisateur import Utilisateur
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class NotificationSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id', required=False,read_only=True)
    Message = serializers.CharField(source='message',required=False,read_only=True)
    IsRead = serializers.BooleanField(source='is_read')
    Emprunt = EmpruntSerializer(source='emprunt', many=False, required=False,read_only=True)
    Date = serializers.DateTimeField(source='date', read_only=True, required=False)
    class Meta:
        model = Group
        fields = ('Id','Message','Emprunt','Date','IsRead',)


