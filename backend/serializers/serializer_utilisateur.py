from django.shortcuts import get_object_or_404
from backend.serializers.serializer_group import GroupSerializer
from backend.serializers.serializer_permission import PermissionSerializer
from django.contrib.auth.models import Permission,Group
from rest_framework import serializers
from backend.models.model_utilisateur import Utilisateur
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


        
class UtilisateurSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id', required=False)
    Email = serializers.CharField(source='email')
    Username = serializers.CharField(source='username')
    Nom = serializers.CharField(source='nom')
    Prenom = serializers.CharField(source='prenom')
    IsActive = serializers.BooleanField(source='is_active', required=False, default=False)
    LastLogin = serializers.CharField(source='last_login', required=False, allow_blank=True, default=None)
    IsSuperuser = serializers.BooleanField(source='is_superuser', required=False, default=False)
    UserPermissions = PermissionSerializer(source='get_user_permissions', read_only=True, many=True)
    DirectUserPermissions = PermissionSerializer(source='user_permissions', many=True, required=False)
    Groups = GroupSerializer(source='groups',required=False, many=True)

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
            'Groups', 
            'UserPermissions',
            'DirectUserPermissions',
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
            'Groups' : {
                'required' : False,
            },
            'UserPermissions' : {
                'required' : False,
            },
            'DirectUserPermissions' : {
                'required' : False,
            },
            'Groups' : {
                'required' : False,
            }
        }
    def validate(self, attrs):
        if(self.context.get('request') is not None):
            if attrs.get('user_permissions') is not None and self.context.get('request').user.id == self.instance.id:
                del attrs['user_permissions']
            if attrs.get('groups') is not None and self.context.get('request').user.id == self.instance.id:
                del attrs['groups']

        return attrs

    def create(self, validated_data):
        groups = []
        
        if validated_data.get('user_permissions') is not None:
            del validated_data['user_permissions']

        if validated_data.get('groups') is not None:
            groups_data = validated_data.pop('groups')
            for group in groups_data:
                groups.append(get_object_or_404(Group.objects.all(), pk=group['id']))

            
        user = Utilisateur.objects.create(**validated_data)
        user.groups.set(groups)

        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.nom = validated_data.get('nom', instance.nom)
        instance.prenom = validated_data.get('prenom', instance.prenom)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        if validated_data.get('groups') is not None:
            groups_data = validated_data.pop('groups')
            groups = []
            for group in groups_data:
                groups.append(get_object_or_404(Group.objects.all(), pk=group['id']))
            instance.groups.set(groups)
        if validated_data.get('user_permissions') is not None:
            permissions_data = validated_data.pop('user_permissions')
            permissions = []
            for permission in permissions_data:
                permissions.append(get_object_or_404(Permission.objects.all(), pk=permission['id']))
            instance.user_permissions.set(permissions)

        instance.save()

        return instance

class ChangePasswordSerializer(serializers.ModelSerializer):
    OldPassword = serializers.CharField(write_only=True, required=True)
    Password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = Utilisateur
        fields = ('OldPassword','Password',)

    def validate(self, attrs):

        return attrs
    def validate_OldPassword(self, value):
            user = self.context['request'].user
            if not user.check_password(value):
                raise serializers.ValidationError(["L'ancien mot de passe est incorrect."])
            return value
    def update(self, instance, validated_data):

        instance.set_password(validated_data['Password'])
        instance.save()

        return instance

class CustomJWTSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        credentials = {
            'email': '',
            'password': attrs.get("password")
        }
        user_obj = Utilisateur.objects.filter(email=attrs.get("email")).first() or Utilisateur.objects.filter(username=attrs.get("email")).first()
        if user_obj:
            if not user_obj.is_active:
                raise serializers.ValidationError(["Le compte utilisateur est désactivé."])
            credentials['email'] = user_obj.email

        return super().validate(credentials)
