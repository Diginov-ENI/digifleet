from django.db.models.fields import related
from backend.models.model_vehicule import Vehicule
from django.db import models
from backend.models.model_site import Site
from backend.models.model_utilisateur import Utilisateur

# model Emprunt
class Emprunt(models.Model):
    date_demande = models.DateTimeField(auto_now_add=True)
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField()
    statut = models.CharField(max_length=15)
    destination = models.CharField(max_length=500)
    commentaire = models.CharField(max_length=2000)
    type = models.CharField(max_length=1)
    site = models.ForeignKey(Site, null=True, on_delete=models.RESTRICT, related_name='emprunts')
    conducteur = models.ForeignKey(Utilisateur, null=True,  on_delete=models.RESTRICT, related_name='emprunts')
    passagers = models.ManyToManyField(Utilisateur, related_name='covoits')
    vehicule = models.ForeignKey(Vehicule, null=True, on_delete=models.RESTRICT, related_name='emprunts')