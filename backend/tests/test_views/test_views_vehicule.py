from django.contrib.auth.models import Permission
from django.core.exceptions import FieldError

from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse
from rest_framework import status

from backend.serializers.serializer_vehicule import VehiculeSerializer
from backend.models.model_vehicule import Vehicule

from backend.serializers.serializer_utilisateur import UtilisateurSerializer
from backend.models.model_utilisateur import Utilisateur


# Create your tests here.
class VehiculeTestCase(APITestCase):
    CONST_VEHICULE_BASE_URL = '/api/vehicules/'

    # Setups 
    def setUp(self):
        self.client = APIClient()
        self.voiture  = Vehicule.objects.create(immatriculation = "ja-158-cv", modele = "Clio"  ,marque = "Renault",couleur = "Noire"  , nb_place = 5)
        self.voiture1 = Vehicule.objects.create(immatriculation = "jb-159-cv", modele = "Mégane",marque = "Renault",couleur = "Blanche", nb_place = 5)
        self.voiture2 = Vehicule.objects.create(immatriculation = "jc-160-cv", modele = "Captur",marque = "Renault",couleur = "Vert"   , nb_place = 5)

        self.client = APIClient()
        self.admin = Utilisateur.objects.create(email='admin@email', username='admin', nom='nom', prenom='prenom', is_active=True, is_superuser=True, password='mdp')
        self.user1 = Utilisateur.objects.create(email='user1@email', username='user1', nom='nom', prenom='prenom', is_active=True, is_superuser=False, password='mdp')
        self.user2 = Utilisateur.objects.create(email='user2@email', username='user2', nom='nom', prenom='prenom', is_active=False, is_superuser=False, password='mdp')

        self.admin.set_password("mdp")
        self.admin.save()
        
        self.user1.set_password("mdp")
        self.user1.save()
        
        self.user2.set_password("mdp")
        self.user2.save()
 

    # Permissions tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_api_jwt(self):
        url = reverse('jwt_login')

        resp = self.client.post(url, {'email':self.admin.email, 'password':'mdp'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        resp = self.client.post(url, {'email':self.admin.username, 'password':'mdp'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        resp = self.client.post(url, {'email':self.admin.email, 'password':'wrongmdp'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

        resp = self.client.post(url, {'email':self.user2.email, 'password':'mdp'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # List tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_list(self):
        self.client.force_login(self.user1)

        url = reverse('vehicule-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

        # On ajoute la permission
        perm = Permission.objects.get(codename="vehicule_list")
        self.user1.user_permissions.add(perm)

        # On restest, cette fois ci on a le droit
        response = self.client.get(url)
        self.assertContains(response, self.voiture1.immatriculation, status_code=status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_list_should_throw_401(self):
        url = reverse('vehicule-list')

        response = self.client.get(url)

        self.assertTemplateNotUsed(response, self.CONST_VEHICULE_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Retrieve tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_retrieve_interdit(self):
        self.client.force_login(self.user1)

        serializer = VehiculeSerializer(self.voiture1)
        url = reverse('vehicule-detail', args=[self.voiture1.id])

        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve(self):
        self.client.force_login(self.user1)
        perm = Permission.objects.get(codename="vehicule_retrieve")
        self.user1.user_permissions.add(perm)
        serializer = VehiculeSerializer(self.voiture1)
        url = reverse('vehicule-detail', args=[self.voiture1.id])

        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_retrieve_should_throw_404(self):
        self.client.force_login(self.user1)

        url = reverse('vehicule-detail', args=[-1])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Create tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_create(self):
        self.client.force_login(self.user1)

        json_new_vehicule = {  
            'immatriculation' : 'ja-158-cv', 
            'modele' : 'Clio'  ,
            'marque' : 'Renault',
            'couleur' : 'Noire'  ,
            'nb_place' : 5,
            'is_active':'True',
        }
        url = reverse('vehicule-list')

        response = self.client.post(url, json_new_vehicule, format='json')

        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="vehicule_create")
        self.user1.user_permissions.add(perm)

        # On restest, cette fois ci on a le droit
        response = self.client.post(url, json_new_vehicule, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['immatriculation'], 'ja-158-cv')
        self.assertIsNot(response.data['id'], None)

    def test_create_should_throw_invalid_serializer(self):
        self.client.force_login(self.admin)

        json_new_vehicule = {  
            'immatriculation' : 'ja-158-cv', 
            'modele' : "Clio",
            'marque' : 'Renault',
            'couleur' : 'Noire'  ,
            'nb_place' : 5,
            'is_active': 5  , #Wrong field
        }
        url = reverse('vehicule-list')

        response = self.client.post(url, json_new_vehicule, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # partial update tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_partial_update(self):
        self.client.force_login(self.user1)

        json_update_vehicule = {  
            'immatriculation' : 'test',
        }
        url = reverse('vehicule-detail', args=[self.voiture2.id])
        response = self.client.patch(url, json_update_vehicule, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="vehicule_update")
        self.user1.user_permissions.add(perm)

        # On restest, cette fois ci on a le droit
        response = self.client.patch(url, json_update_vehicule, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['immatriculation'], 'test')
        self.assertEqual(response.data['modele'], self.voiture2.modele)
        self.assertEqual(response.data['id'], self.voiture2.id)
    
    # Destroy tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_destroy(self):
        self.client.force_login(self.user1)

        url = reverse('vehicule-detail', args=[self.voiture2.id])

        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # On ajoute la permission
        perm = Permission.objects.get(codename="vehicule_destroy")
        self.user1.user_permissions.add(perm)

        # On restest, cette fois ci on a le droit
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Vehicule.objects.filter(id__exact=self.voiture2.id))

    def test_destroy_should_throw_404(self):
        self.client.force_login(self.admin)

        url = reverse('vehicule-detail', args=[-1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
