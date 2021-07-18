from backend.serializers.serializer_vehicule import VehiculeSerializer
from backend.models.model_vehicule import Vehicule
from rest_framework import serializers
from backend.models.model_emprunt import Emprunt
from backend.models.model_site import Site
from backend.models.model_utilisateur import Utilisateur
from django.shortcuts import get_object_or_404
from django.core.exceptions import FieldError
from django.db.models import Q, OuterRef, Exists

class SiteSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id')
    Libelle = serializers.CharField(source='libelle', read_only=True)

    class Meta:
        model = Site
        fields = (
            'Id', 
            'Libelle', 
        )

class UtilisateurSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id')
    Nom = serializers.CharField(source='nom', required=False)
    Prenom = serializers.CharField(source='prenom', required=False)

    class Meta:
        model = Utilisateur
        fields = (
            'Id', 
            'Nom', 
            'Prenom', 
        )


class VehiculeSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id')
    Marque = serializers.CharField(source='marque', required=False)
    Modele = serializers.CharField(source='modele', required=False)

    class Meta:
        model = Utilisateur
        fields = (
            'Id', 
            'Marque', 
            'Modele', 
        )

class EmpruntSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id', read_only=True, required=False)
    DateDemande = serializers.DateTimeField(source='date_demande', read_only=True, required=False)
    DateDebut = serializers.DateTimeField(source='date_debut', required=True)
    DateFin = serializers.DateTimeField(source='date_fin', required=False)
    Statut = serializers.CharField(source='statut', required=False)
    Destination = serializers.CharField(source='destination', required=True)
    Commentaire = serializers.CharField(source='commentaire', required=False, allow_blank=True)
    Type = serializers.CharField(source='type', required=True)
    Site = SiteSerializer(source='site', required=True)
    Conducteur = UtilisateurSerializer(source='conducteur', required=True)
    Passagers = UtilisateurSerializer(source='passagers', many=True, required=False)
    Vehicule = VehiculeSerializer(source='vehicule', required=False)

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
            'Passagers',
            'Vehicule'
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
             'Vehicule' : {
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
        
        # ---------- DEBUT VALIDATION ---------- 
        # --- VALIDATION --- On vérifie que le conducteur courant n'est pas déjà associé à un autre emprunt sur le même interval temporaire en tant que conducteur
        if Emprunt.objects.filter(
            Q(date_debut__lte=validated_data['date_fin']),
            Q(date_fin__gte=validated_data['date_debut']),
            Q(conducteur_id=conducteur_data['id']),
            ).distinct().exists():
            raise FieldError # TODO : add specific exception with message

        # On récupère tous les passagers sur le meme interval de temps
        passagers_by_interval = self.list_passagers_by_interval(validated_data['date_fin'], validated_data['date_debut'])
       
        # --- VALIDATION ---  On vérifie que le conducteur courant n'est pas déjà associé à un autre emprunt sur le même interval temporaire en tant que passagers
        for passager_by_interval in passagers_by_interval:
            if passager_by_interval and passager_by_interval.filter(pk=conducteur_data['id']).exists():
                raise FieldError # TODO : add specific exception with message

        # --- VALIDATION ---  On vérifie qu'aucun des passagers courants ne soit associé à un autre emprunt sur le même interval temporaire en tant que passagers
        for passager_data in passagers_data:
            for passager_by_interval in passagers_by_interval:
                if passager_by_interval and passager_by_interval.filter(pk=passager_data['id']).exists():
                    raise FieldError # TODO : add specific exception with message
            # --- VALIDATION ---  On vérifie qu'aucun de nos passagers courants n'est associé à un autre emprunt sur le même interval en tant que conducteur
            if Emprunt.objects.filter(
                Q(date_debut__lte=validated_data['date_fin']),
                Q(date_fin__gte=validated_data['date_debut']),
                Q(conducteur_id=passager_data['id']),
                ).distinct().exists():
                raise FieldError # TODO : add specific exception with message
            #  --- VALIDATION --- On vérifie que le conducteur courant ne soit pas passagers courants
            if passager_data['id'] == conducteur_data['id']:
                raise FieldError # TODO : add specific exception with message
        # ---------- FIN VALIDATION ---------- 
       
        emprunt = Emprunt.objects.create(site=site, conducteur=conducteur, **validated_data)
        emprunt.passagers.set(passagers)

        return emprunt

    def update(self, instance, validated_data):
        """
        Il est nécéssaire de surcharger la méthode update par défaut pour 
        définir comment gérer les objets liés à un emprunt.
        """
        instance.date_debut = validated_data.get('date_debut', instance.date_debut)
        instance.date_fin = validated_data.get('date_fin', instance.date_fin)
        # TODO : Vérification droit de modification du statut
        instance.statut = validated_data.get('statut', instance.statut)
        instance.destination = validated_data.get('destination', instance.destination)
        instance.commentaire = validated_data.get('commentaire', instance.commentaire)
        instance.type = validated_data.get('type', instance.type)
        if validated_data.get('site') is not None:
            site_data = validated_data.pop('site')
            site = get_object_or_404(Site.objects.all(), pk=site_data['id'])
            instance.site = site
        if validated_data.get('conducteur') is not None:
            conducteur_data = validated_data.pop('conducteur')
            conducteur = get_object_or_404(Utilisateur.objects.all(), pk=conducteur_data['id'])
            instance.conducteur = conducteur
        if validated_data.get('passagers') is not None:
            passagers_data = validated_data.pop('passagers')
            passagers = []
            for passager in passagers_data:
                passagers.append(get_object_or_404(Utilisateur.objects.all(), pk=passager['id']))

            # ---------- DEBUT VALIDATION ---------- 
            # On récupère tous les passagers sur le meme interval de temps
            passagers_by_interval = self.list_passagers_by_interval(instance.date_fin, instance.date_debut)

            # --- VALIDATION ---  On vérifie qu'aucun un des passagers courants ne soit déjà associé à un autre emprunt sur le même interval temporaire en tant que passagers
            for passager in passagers:
                for passager_by_interval in passagers_by_interval:
                    if passager_by_interval and passager_by_interval.filter(pk=passager.id).exists():
                        raise FieldError # TODO : add specific exception with message
                # --- VALIDATION ---  On vérifie qu'aucun de nos passagers courants n'est associé à un autre emprunt sur le même interval en tant que conducteur
                if Emprunt.objects.filter(
                    Q(date_debut__lte=instance.date_fin),
                    Q(date_fin__gte=instance.date_debut),
                    Q(conducteur_id=passager.id),
                    ).distinct().exists():
                    raise FieldError # TODO : add specific exception with message
                #  --- VALIDATION --- On vérifie qu'aucun des passagers courants ne soit conducteur courant
                if passager.id == instance.conducteur.id:
                    raise FieldError # TODO : add specific exception with message
            # ---------- FIN VALIDATION ---------- 
            
            instance.passagers.set(passagers)

        # TODO : Vérification droit de modification du véhicule
        if validated_data.get('vehicule') is not None:
            vehicule_data = validated_data.pop('vehicule')
            vehicule = get_object_or_404(Vehicule.objects.all(), pk=vehicule_data['id'])
            # --- VALIDATION --- On vérifie que le véhicule n'est pas déjà associé à un autre emprunt sur le même interval temporaire
            if Emprunt.objects.filter(
                Q(date_debut__lte=instance.date_fin),
                Q(date_fin__gte=instance.date_debut),
                vehicule_id=vehicule_data['id'],).distinct().exists():
                raise FieldError # TODO : add specific exception with message
            instance.vehicule = vehicule

        instance.save()

        return instance

    def list_passagers_by_interval(self, date_fin, date_debut):
        """
        Permet de récupérer tous les passagers d'après l'interval de temps de leurs emprunts
        """
         # On récupère tous les emprunts sur le meme interval de temps
        emprunts = Emprunt.objects.filter(
            Q(date_debut__lte=date_fin),
            Q(date_fin__gte=date_debut),
            ).distinct().prefetch_related('passagers')
        
        # On retourne tous les passagers de ces emprunts
        return [emprunt.passagers.all() for emprunt in emprunts]
        
     