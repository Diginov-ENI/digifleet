from django.test import TestCase
from django.test.utils import isolate_apps
from django.urls import reverse

from backend.models import Utilisateur

# Create your tests here.
class UtilisateurTestCase(TestCase):
    # Setups 
    def create_utilisateur(self, email="user@email", username="user", nom="nom", prenom="prenom", isActive="true", isSuperUser="false", password="mdp"):
        return Utilisateur.objects.create(email=email, username=username, nom=nom, prenom=prenom, isActive=isActive, isSuperUser=isSuperUser, password=password)

    def setUp(self):
        self.admin = Utilisateur.objects.create_superuser(email="admin@email", username="admin", nom="nom", prenom="prenom", isActive="true", isSuperUser="true", password="mdp")
        self.activeUser1 = Utilisateur.objects.create_user(email="user1@email", username="user1", nom="nom", prenom="prenom", isActive="true", isSuperUser="false", password="mdp")
        self.inactiveUser2 = Utilisateur.objects.create_user(email="user2@email", username="user2", nom="nom", prenom="prenom", isActive="false", isSuperUser="false", password="mdp")

    # Models tests
    def test_create_user(self):
        user = self.create_utilisateur()
        self.assertIsInstance(user, Utilisateur)
        

    # Views tests
    def test_utilisateur_list_view(self):
        user = self.create_utilisateur()
        url = reverse("backend.views.list")
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertIn(user.username, resp.content)