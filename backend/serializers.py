from rest_framework import serializers
from backend.models import Utilisateur

class UtilisateurSerializer(serializers.ModelSerializer):
    Id = serializers.CharField(source='id')
    Email = serializers.CharField(source='email')
    Username = serializers.CharField(source='username')
    Nom = serializers.CharField(source='nom')
    Prenom = serializers.CharField(source='prenom')
    IsActive = serializers.CharField(source='is_active')
    LastLogin = serializers.CharField(source='last_login')
    IsSuperuser = serializers.CharField(source='is_superuser')
    Groups = serializers.CharField(source='groups')
    UserPermissions = serializers.CharField(source='user_permissions')

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
        'UserPermissions', )