from django.test import TestCase
from django.test.utils import isolate_apps
from django.urls import reverse

from backend.models import Vehicule
from backend.views import VehiculeViewSet

# Create your tests here.
class VehiculeTestCase(TestCase):
     # Models tests -------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_create_vehicule(self):
        vehicule = Vehicule.objects.create(marque='Peugot', modele = '406', immatriculation = 'az123er', couleur = 'bleu', nb_place = 4)
        self.assertIsInstance(vehicule, Vehicule)

