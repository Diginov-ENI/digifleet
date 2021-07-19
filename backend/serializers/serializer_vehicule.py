from rest_framework import serializers
from backend.models.model_vehicule import Vehicule
from backend.models.model_site import Site
from django.shortcuts import get_object_or_404

class SiteSerializer(serializers.ModelSerializer):
    Id = serializers.CharField(source='id')
    Libelle = serializers.CharField(source='libelle', read_only=True)

    class Meta:
        model = Site
        fields = (
            'Id', 
            'Libelle', 
        )

class VehiculeSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id', required=False)
    Immatriculation = serializers.CharField(source='immatriculation')
    Modele = serializers.CharField(source='modele')
    Marque = serializers.CharField(source='marque')
    Couleur = serializers.CharField(source='couleur')
    NbPlace = serializers.CharField(source='nb_place')
    IsActive = serializers.BooleanField(source='is_active', required=False, default=False)
    Site = SiteSerializer(source='site', required=True)
    class Meta:
        model = Vehicule
        fields = ('Id',
                  'Immatriculation',
                  'Modele',
                  'Marque',
                  'Couleur',
                  'NbPlace',
                  'IsActive',
                  'Site')

        extra_kwargs = {
            'Id' : {
                'required' : False,
            },
            'isActive' : {
                'required' : False,
            }
        }

    def create(self, validated_data):
        """
        Il est nécéssaire de surcharger la méthode create par défaut pour 
        définir comment gérer les objets liés à un véhicule.
        """
        # Find site object
        site_data = validated_data.pop('site')
        site = get_object_or_404(Site.objects.all(), pk=site_data['id'])
       
        vehicule = Vehicule.objects.create(site=site, **validated_data)

        return vehicule

    def update(self, instance, validated_data):
        """
        Il est nécéssaire de surcharger la méthode update par défaut pour 
        définir comment gérer les objets liés à un véhicule.
        """
        instance.immatriculation = validated_data.get('immatriculation', instance.immatriculation)
        instance.modele = validated_data.get('modele', instance.modele)
        instance.marque = validated_data.get('marque', instance.marque)
        instance.couleur = validated_data.get('couleur', instance.couleur)
        instance.nb_place = validated_data.get('nb_place', instance.nb_place)
        instance.is_active = validated_data.get('is_active', instance.is_active)

        if validated_data.get('site') is not None:
            site_data = validated_data.pop('site')
            site = get_object_or_404(Site.objects.all(), pk=site_data['id'])
            instance.site = site

        instance.save()
        return instance
        
     