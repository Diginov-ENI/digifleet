from django.db import models
from backend.models.model_site import Site

class Vehicule(models.Model):
    immatriculation = models.CharField(max_length=50)
    modele = models.CharField(max_length=50)
    marque = models.CharField(max_length=30)
    couleur = models.CharField(max_length=30)
    nb_place = models.IntegerField()
    is_active = models.BooleanField(default=True)
    site = models.ForeignKey(Site, null=True, on_delete=models.RESTRICT, related_name='vehicules')
