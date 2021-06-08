
from django.shortcuts import get_object_or_404
from backend.serializers.serializer_permission import PermissionSerializer
from django.contrib.auth.models import Permission,Group
from rest_framework import serializers
from backend.models.model_utilisateur import Utilisateur
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class SimpleUtilisateurSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id', required=False)
    Email = serializers.CharField(source='email')
    Username = serializers.CharField(source='username')
    Nom = serializers.CharField(source='nom')
    Prenom = serializers.CharField(source='prenom')
    IsActive = serializers.BooleanField(source='is_active', required=False, default=False)
    LastLogin = serializers.CharField(source='last_login', required=False, allow_blank=True, default=None)
    IsSuperuser = serializers.BooleanField(source='is_superuser', required=False, default=False)

    class Meta:
        model = Utilisateur
        fields = (
            'Id', 
            'Email', 
            'Username', 
            'Nom', 
            'Prenom', 
            'IsActive', 
            'LastLogin', 
            'IsSuperuser', 
        )
        extra_kwargs = {
            'Id' : {
                'required' : False,
            },
            'IsActive' : {
                'required' : False,
            },
            'LastLogin' : {
                'required' : False,
            },
        }



class GroupSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id', required=False)
    Name = serializers.CharField(source='name')
    Permissions = PermissionSerializer(source='permissions', many=True, required=True)
    Utilisateurs = serializers.SerializerMethodField('get_user_in_group')
    class Meta:
        model = Group
        fields = ('Id','Name','Permissions','Utilisateurs',)
    def get_user_in_group(self,group):
       return SimpleUtilisateurSerializer(Utilisateur.objects.filter(groups__id=group.id),many=True).data

    def create(self, validated_data):
        permissions = []
        
        if validated_data.get('permissions') is not None:
            permissions_data = validated_data.pop('permissions')
            for permission in permissions_data:
                permissions.append(get_object_or_404(Permission.objects.all(), pk=permission['id']))

        group = Group.objects.create(**validated_data)
        group.permissions.set(permissions)

        return group

    def update(self, instance, validated_data):
       
        instance.name = validated_data.get('name', instance.name)
        if validated_data.get('permissions') is not None:
            permissions_data = validated_data.pop('permissions')
            permissions = []
            for permission in permissions_data:
                permissions.append(get_object_or_404(Permission.objects.all(), pk=permission['id']))
            instance.permissions.set(permissions)

        instance.save()

        return instance

