from django.db import models
from backend.models.model_vehicule import Vehicule

class Clef(models.Model):
    libelle = models.CharField(max_length=200)
    vehicule = models.ForeignKey(Vehicule, on_delete=models.CASCADE)