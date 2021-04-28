from django.forms.fields import EmailField
from django.test import TestCase
from django.test.utils import isolate_apps
from django.urls import reverse

from backend.models import Utilisateur

# Create your tests here.
class UtilisateurTestCase(TestCase):
    def setUp(self):
        self.admin = Utilisateur.objects.create_superuser(email="admin@email", username="admin", nom="nom", prenom="prenom", isActive="true", isSuperUser="true", password="mdp")
        self.activeUser1 = Utilisateur.objects.create_user(email="user1@email", username="user1", nom="nom", prenom="prenom", isActive="true", isSuperUser="false", password="mdp")
        self.inactiveUser2 = Utilisateur.objects.create_user(email="user2@email", username="user2", nom="nom", prenom="prenom", isActive="false", isSuperUser="false", password="mdp")

    def test_list_not_authenticated_user(self):
        url = reverse('backend:users-list')
        response = self.client.get(url)
        self.assertTemplateNotUsed(response, 'Digifleet/liste-utilisateur')
        self.failUnlessEqual(response.status_code, 302)