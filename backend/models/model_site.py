from django.db import models

# model Site
class Site(models.Model):
    libelle = models.CharField(max_length=200, unique=True)
    is_active = models.BooleanField(default=True)