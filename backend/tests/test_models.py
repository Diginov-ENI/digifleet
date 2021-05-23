from django.test import TestCase
from django.test.utils import isolate_apps
from django.urls import reverse

from backend.models import Utilisateur
from backend.views import UtilisateurViewSet

# Create your tests here.
class UtilisateurTestCase(TestCase):
     # Models tests -------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_create_simple_user(self):
        user = Utilisateur.objects.create_user(email="user2@email", username="user2", nom="nom", prenom="prenom", password="mdp")
        self.assertIsInstance(user, Utilisateur)
        self.assertEqual(user.is_active, True)
        self.assertEqual(user.is_superuser, False)


    def test_create_superuser(self):
        user = Utilisateur.objects.create_superuser(email="admin@email", username="admin", nom="nom", prenom="prenom", password="mdp")
        self.assertIsInstance(user, Utilisateur)
        self.assertEqual(user.is_active, True)
        self.assertEqual(user.is_superuser, True)