from rest_framework import serializers
from backend.models import Vehicule
from backend.models import Clef


class VehiculeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicule
        fields = ('id',
                  'immatriculation',
                  'modele',
                  'marque',
                  'couleur')


class ClefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clef
        fields = ('id',
                  'libelle')
