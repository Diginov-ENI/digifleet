from rest_framework import serializers
from backend.models import Utilisateur
from backend.models import Vehicule
from backend.models import Clef


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
    UserPermissions = serializers.CharField(source='user_permissions', required=False, allow_blank=True)

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
            }
        }


class VehiculeSerializer(serializers.ModelSerializer):
    Id = serializers.CharField(source='id', required=False, allow_blank=True)
    Immatriculation = serializers.CharField(source='immatriculation')
    Modele = serializers.CharField(source='modele')
    Marque = serializers.CharField(source='marque')
    Couleur = serializers.CharField(source='couleur')
    Nb_place = serializers.IntegerField(source='nb_place')

    class Meta:
        model = Vehicule
        fields = ('Id',
                  'Immatriculation',
                  'Modele',
                  'Marque',
                  'Couleur',
                  'Nb_place')


class ClefSerializer(serializers.ModelSerializer):
    Id = serializers.CharField(source='id', required=False, allow_blank=True)
    Libelle = serializers.CharField(source='libelle')

    class Meta:
        model = Clef
        fields = ('Id',
                  'Libelle')
