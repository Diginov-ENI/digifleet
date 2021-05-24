from .models import Utilisateur
from django.contrib import admin
from backend.models import Vehicule

# Register your models here.
admin.site.register(Vehicule)
#admin.site.register(Utilisateur, UserAdmin)
