from django.db import models

from backend.models.Vehicule import Vehicule


class Clef(models.Model):
    id = models.AutoField(primary_key=True)
    libelle = models.CharField(max_length=200)
    vehicule = models.ForeignKey(Vehicule, on_delete=models.CASCADE)

