from rest_framework import serializers
from backend.models import Utilisateur

class UtilisateurSerializer(serializers.ModelSerializer):

    class Meta:
        model = Utilisateur
        fields = ('id', 
        'email', 
        'username', 
        'nom', 
        'prenom', 
        'is_active', 
        'last_login', 
        'is_superuser', 
        'groups', 
        'user_permissions', )