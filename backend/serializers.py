from django.contrib.auth.models import Permission,Group
from rest_framework import serializers
from backend.models import Utilisateur
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class PermissionSerializer(serializers.ModelSerializer):
    Codename = serializers.CharField(source='codename')

    class Meta:
        model = Permission
        fields = ('Codename',)

class GroupSerializer(serializers.ModelSerializer):
    Name = serializers.CharField(source='name')
    Permissions = PermissionSerializer(source='permissions', read_only=True, many=True)
    class Meta:
        model = Group
        fields = ('Name','Permissions',)
        
class UtilisateurSerializer(serializers.ModelSerializer):
    Id = serializers.CharField(source='id', required=False, allow_blank=True)
    Email = serializers.CharField(source='email')
    Username = serializers.CharField(source='username')
    Nom = serializers.CharField(source='nom')
    Prenom = serializers.CharField(source='prenom')
    IsActive = serializers.CharField(source='is_active', required=False, allow_blank=True, default=False)
    LastLogin = serializers.CharField(source='last_login', required=False, allow_blank=True, default=None)
    IsSuperuser = serializers.CharField(source='is_superuser', required=False, allow_blank=True, default=False)
    Groups = serializers.CharField(source='groups', required=False, allow_blank=True)
    UserPermissions = PermissionSerializer(source='get_user_permissions', read_only=True, many=True)
    Groups = GroupSerializer(source='groups', read_only=True, many=True)

    class Meta:
        model = Utilisateur
        fields = ('Id', 
        'Email', 
        'Username', 
        'Nom', 
        'Prenom', 
        'IsActive', 
        'LastLogin', 
        'IsSuperuser', 
        'Groups', 
        'UserPermissions',
        'Groups', )
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
            'Groups' : {
                'required' : False,
            }
        }

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