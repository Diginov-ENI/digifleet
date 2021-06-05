from rest_framework import serializers
from backend.models.model_emprunt import Emprunt
from backend.models.model_site import Site
from backend.models.model_utilisateur import Utilisateur
from django.shortcuts import get_object_or_404, get_list_or_404



class SiteSerializer(serializers.ModelSerializer):
    Id = serializers.CharField(source='id')

    class Meta:
        model = Site
        fields = ('Id',)

class UtilisateurSerializer(serializers.ModelSerializer):
    Id = serializers.CharField(source='id')

    class Meta:
        model = Utilisateur
        fields = ('Id',)

class EmpruntSerializer(serializers.ModelSerializer):
    Id = serializers.CharField(source='id', read_only=True, required=False, allow_blank=True)
    DateDemande = serializers.DateTimeField(source='date_demande', required=False)
    DateDebut = serializers.DateTimeField(source='date_debut', required=True)
    DateFin = serializers.DateTimeField(source='date_fin', required=False)
    Statut = serializers.CharField(source='statut', required=False)
    Destination = serializers.CharField(source='destination', required=True)
    Commentaire = serializers.CharField(source='commentaire', required=False)
    Type = serializers.CharField(source='type', required=True)
    Site = SiteSerializer(source='site', required=True)
    Conducteur = UtilisateurSerializer(source='conducteur', required=True)
    Passagers = UtilisateurSerializer(source='passagers', many=True, required=False)

    class Meta:
        model = Emprunt
        fields = (
            'Id', 
            'DateDemande',
            'DateDebut',
            'DateFin',
            'Statut',
            'Destination',
            'Commentaire',
            'Type',
            'Site',
            'Conducteur',
            'Passagers'
        )
        extra_kwargs = {
            'Id' : {
                'required' : False,
            },
             'DateDemande' : {
                'required' : False,
            },
             'Statut' : {
                'required' : False,
            },
             'Commentaire' : {
                'required' : False,
            },
        }

    def create(self, validated_data):
        """
        Il est nécéssaire de surcharger la méthode create par défaut pour 
        définir comment gérer les objets liés à un emprunt.
        """
        # Find site object
        site_data = validated_data.pop('site')
        site = get_object_or_404(Site.objects.all(), pk=site_data['id'])
        # Find conducteur object
        conducteur_data = validated_data.pop('conducteur')
        conducteur = get_object_or_404(Utilisateur.objects.all(), pk=conducteur_data['id'])
        # Find passagers object
        passagers_data = validated_data.pop('passagers')
        passagers = []
        for passager in passagers_data:
            passagers.append(get_object_or_404(Utilisateur.objects.all(), pk=passager['id']))

        emprunt = Emprunt.objects.create(site=site, conducteur=conducteur, **validated_data)
        emprunt.passagers.set(passagers)

        return emprunt

    def update(self, instance, validated_data):
        instance.date_debut = validated_data.get('date_debut', instance.date_debut)
        instance.date_fin = validated_data.get('date_fin', instance.date_fin)
        instance.statut = validated_data.get('statut', instance.statut)
        instance.destination = validated_data.get('destination', instance.destination)
        instance.commentaire = validated_data.get('commentaire', instance.commentaire)
        instance.type = validated_data.get('type', instance.type)
        if validated_data.get('site'):
            site_data = validated_data.pop('site')
            site = get_object_or_404(Site.objects.all(), pk=site_data['id'])
            instance.site = site
        if validated_data.get('conducteur'):
            conducteur_data = validated_data.pop('conducteur')
            conducteur = get_object_or_404(Utilisateur.objects.all(), pk=conducteur_data['id'])
            instance.conducteur = conducteur
        if validated_data.get('passagers'):
            passagers_data = validated_data.pop('passagers')
            passagers = []
            for passager in passagers_data:
                passagers.append(get_object_or_404(Utilisateur.objects.all(), pk=passager['id']))
            instance.passagers.set(passagers)

        instance.save()

        return instance
     