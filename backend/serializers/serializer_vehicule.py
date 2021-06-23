from rest_framework import serializers
from backend.models.model_vehicule import Vehicule



class VehiculeSerializer(serializers.ModelSerializer):
    # Id = serializers.CharField(source='id', required=False, allow_blank=True)
    # Immatriculation = serializers.CharField(source='immatriculation')
    # Modele = serializers.CharField(source='modele')
    # Marque = serializers.CharField(source='marque')
    # Couleur = serializers.CharField(source='couleur')
    # Nb_place = serializers.CharField(source='nb_place')
    # Is_active = serializers.BooleanField(source='is_active', required=False, default=False)
    class Meta:
        model = Vehicule
        fields = ('id',
                  'immatriculation',
                  'modele',
                  'marque',
                  'couleur',
                  'nb_place',
                  'is_active')

        extra_kwargs = {
            'id' : {
                'required' : False,
            },
            'is_active' : {
                'required' : False,
            }
        }