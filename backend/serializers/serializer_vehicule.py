from rest_framework import serializers
from backend.models.model_vehicule import Vehicule

class VehiculeSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id', required=False)
    Immatriculation = serializers.CharField(source='immatriculation')
    Modele = serializers.CharField(source='modele')
    Marque = serializers.CharField(source='marque')
    Couleur = serializers.CharField(source='couleur')
    NbPlace = serializers.CharField(source='nb_place')
    IsActive = serializers.BooleanField(source='is_active', required=False, default=False)
    class Meta:
        model = Vehicule
        fields = ('Id',
                  'Immatriculation',
                  'Modele',
                  'Marque',
                  'Couleur',
                  'NbPlace',
                  'IsActive')

        extra_kwargs = {
            'Id' : {
                'required' : False,
            },
            'isActive' : {
                'required' : False,
            }
        }