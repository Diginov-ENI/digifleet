from django.test import TestCase
from django.test.utils import isolate_apps

from rest_framework.test import APIClient
from rest_framework.reverse import reverse
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate

from backend.models import Utilisateur
from backend.views import UtilisateurViewSet

# Create your tests here.
class UtilisateurTestCase(TestCase):
    # Setups 
    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()

        self.admin = Utilisateur.objects.create(email="admin@email", username="admin", nom="nom", prenom="prenom", is_active=True, is_superuser=True, password="mdp")
        self.user1 = Utilisateur.objects.create(email="user1@email", username="user1", nom="nom", prenom="prenom", is_active=True, is_superuser=False, password="mdp")
        self.user2 = Utilisateur.objects.create(email="user2@email", username="user2", nom="nom", prenom="prenom", is_active=True, is_superuser=False, password="mdp")
        self.user3 = Utilisateur.objects.create(email="user3@email", username="user3", nom="nom", prenom="prenom", is_active=True, is_superuser=False, password="mdp")

    # Views tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_utilisateur_not_authenticated_user(self):
        url = reverse('utilisateur-list')
        response = self.client.get(url)

        self.assertTemplateNotUsed(response, 'api/utilisateurs')
        self.failUnlessEqual(response.status_code, 401)
    
    # FIXME - authentication not working
    def test_utilisateur_list_view(self):
        self.client.login(email='admin@email', password='mdp')

        url = reverse('utilisateur-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertIn(self.user1, request.content)