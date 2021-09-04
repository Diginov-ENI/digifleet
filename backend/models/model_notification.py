from backend.models.model_emprunt import Emprunt
from backend.models.model_utilisateur import Utilisateur
from django.db import models
from django.utils import timezone

class Notification(models.Model):
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    utilisateur = models.ForeignKey(Utilisateur, null=False, on_delete=models.RESTRICT, related_name='notification')
    emprunt = models.ForeignKey(Emprunt, null=True, on_delete=models.RESTRICT, related_name='notification')
    date = models.DateTimeField(default=timezone.now )
