from django.db import models

class Vehicule(models.Model):
    immatriculation = models.CharField(max_length=50)
    modele = models.CharField(max_length=50)
    marque = models.CharField(max_length=30)
    couleur = models.CharField(max_length=30)
    nb_place = models.IntegerField()
    is_active = models.BooleanField(default=True)

