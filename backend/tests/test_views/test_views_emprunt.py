from backend.models.model_emprunt import Emprunt
from django.contrib.auth.models import Permission
from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse
from rest_framework import status
from backend.serializers.serializer_emprunt import EmpruntSerializer
from backend.models.model_utilisateur import Utilisateur
from backend.models.model_site import Site
from backend.models.model_emprunt import Emprunt
from django.utils import timezone


# Create your tests here.
class EmpruntTestCase(APITestCase):
    CONST_EMPRUNT_BASE_URL = '/api/emprunts/'

    # Setups 
    def setUp(self):
        self.client = APIClient()
        self.admin = Utilisateur.objects.create(email='admin@email', username='admin', nom='nom', prenom='prenom', is_active=True, is_superuser=True)
        self.user1 = Utilisateur.objects.create(email='user1@email', username='user1', nom='nom', prenom='prenom', is_active=True, is_superuser=False)
        self.user2 = Utilisateur.objects.create(email='user2@email', username='user2', nom='nom', prenom='prenom', is_active=True, is_superuser=False)
        self.user3 = Utilisateur.objects.create(email='user3@email', username='user3', nom='nom', prenom='prenom', is_active=True, is_superuser=False)
        self.user4 = Utilisateur.objects.create(email='user4@email', username='user4', nom='nom', prenom='prenom', is_active=True, is_superuser=False)

        self.admin.set_password("mdp")
        self.admin.save()
        self.user1.set_password("mdp")
        self.user1.save()
        self.user2.set_password("mdp")
        self.user2.save()
        self.user3.set_password("mdp")
        self.user3.save()
        self.user4.set_password("mdp")
        self.user4.save()

        self.site1 = Site.objects.create(libelle='ENI Nantes')
        self.site2 = Site.objects.create(libelle='ENI Rennes')

        self.emprunt1 = Emprunt.objects.create(
            date_debut=timezone.now(), 
            date_fin=timezone.now(), 
            statut='EN_COURS', 
            destination='Cholet', 
            commentaire='', 
            type='S', 
            site=self.site1, 
            conducteur=self.user1, 
        )

        self.emprunt2 = Emprunt.objects.create(
            date_debut=timezone.now(), 
            date_fin=timezone.now(), 
            statut='DEPOSEE', 
            destination='Toulouse', 
            commentaire='Besoin d\'un vehicule spatieux svp', 
            type='S', 
            site=self.site1, 
            conducteur=self.user2, 
        )
        self.emprunt2.passagers.set([self.user1, self.user3])

    # List tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_list(self):
        self.client.force_login(self.user1)

        url = reverse('emprunt-list')

        # On ajoute la permission
        perm = Permission.objects.get(codename="emprunt_list")
        self.user1.user_permissions.add(perm)

        response = self.client.get(url)
        self.assertContains(response, self.emprunt1.destination, status_code=status.HTTP_200_OK)
        self.assertEqual(len(response.data["Data"]), 2)

    def test_list_should_throw_401(self):
        url = reverse('emprunt-list')
        response = self.client.get(url)

        self.assertTemplateNotUsed(response, self.CONST_EMPRUNT_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_should_throw_403(self):
        self.client.force_login(self.user1)

        url = reverse('emprunt-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

    # Retrieve tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_retrieve_as_conducteur(self):
        """
        On vérifie qu'un utilisateur peut récupérer un emprunt dont il est conducteur
        """
        self.client.force_login(self.user1)

        serializer = EmpruntSerializer(self.emprunt1)
        url = reverse('emprunt-detail', args=[self.emprunt1.id])

        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["Data"], serializer.data)

    def test_retrieve_as_passager(self):
        """
        On vérifie qu'un utilisateur peut récupérer un emprunt dont il est passager
        """
        self.client.force_login(self.user1)

        serializer = EmpruntSerializer(self.emprunt2)
        url = reverse('emprunt-detail', args=[self.emprunt2.id])

        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["Data"], serializer.data)

    def test_retrieve_other(self):
        """
        On vérifie qu'un utilisateur peut récupérer un emprunt dont il n'est NI conducteur NI passager
        seulement si il en possède les droits
        """
        self.client.force_login(self.admin)

        serializer = EmpruntSerializer(self.emprunt1)
        url = reverse('emprunt-detail', args=[self.emprunt1.id])  
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="emprunt_retrieve")
        self.admin.user_permissions.add(perm)

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["Data"], serializer.data)

    def test_retrieve_should_throw_401(self):
        url = reverse('emprunt-detail', args=[self.emprunt1.id])
        response = self.client.get(url)

        self.assertTemplateNotUsed(response, self.CONST_EMPRUNT_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_should_throw_403(self):
        self.client.force_login(self.user4)

        url = reverse('emprunt-detail', args=[self.emprunt1.id])
        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_should_throw_404(self):
        self.client.force_login(self.user1)

        url = reverse('emprunt-detail', args=[-1])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Create tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_create(self):
        self.client.force_login(self.user1)

        json_new_emprunt = {  
           'DateDebut': '2222-09-03T20:18',
           'DateFin': '2222-09-03T20:18',
           'Statut':  'DEPOSEE',
           'Destination': 'Le Mans',
           'Commentaire': 'Mon commentaire',
           'Type': 'F',
           'Site':  {'Id': self.site1.id},
           'Conducteur': {'Id': self.user1.id},
           'Passagers': [
               {'Id': self.user2.id},
               {'Id': self.user3.id}
           ]
        }
        url = reverse('emprunt-list')
        
        #On ajoute la permission
        perm = Permission.objects.get(codename="emprunt_create")
        self.user1.user_permissions.add(perm)
    
        response = self.client.post(url, json_new_emprunt, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["Data"]['Destination'], 'Le Mans')
        self.assertIsNot(response.data["Data"]['Id'], None)

    def test_create_should_throw_401(self):
        json_new_emprunt = {  
            'DateDebut': '2222-09-03T20:18',
            'DateFin': '2222-09-03T20:18',
            'Statut':  'DEPOSEE',
            'Destination': 'Le Mans',
            'Commentaire': 'Mon commentaire',
            'Type': 'F',
            'Site':  {'Id': self.site1.id},
            'Conducteur': {'Id': self.user1.id},
            'Passagers': [
                {'Id': self.user2.id},
                {'Id': self.user3.id}
            ]
        }
        url = reverse('emprunt-list')
        response = self.client.post(url, json_new_emprunt, format='json')

        self.assertTemplateNotUsed(response, self.CONST_EMPRUNT_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_should_throw_invalid_serializer(self):
        self.client.force_login(self.admin)

        json_new_emprunt = {  
            'dateDebut': '2021-06-03T20:18', # Wrong field
            'DateFin': '2021-06-03T20:18',
            'Statut':  'DEPOSEE',
            'Destination': 'Le Mans',
            'Commentaire': 'Mon commentaire',
            'Type': 'F',
            'Site':  {'Id': self.site1.id},
            'Conducteur': {'Id': self.user1.id},
            'Passagers': [
                {'Id': self.user2.id},
                {'Id': self.user3.id}
            ]
        }
        url = reverse('emprunt-list')

        response = self.client.post(url, json_new_emprunt, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # partial update tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_partial_update(self):
        """
        On vérifie qu'un utilisateur peut màj un emprunt dont il n'est pas conducteur
        seulement si il en possède les droits
        """
        self.client.force_login(self.admin)

        json_update_emprunt = {  
            'Destination': 'Paris',
            'Site':  {'Id': self.site2.id},
        }
        url = reverse('emprunt-detail', args=[self.emprunt1.id])
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="emprunt_update")
        self.admin.user_permissions.add(perm)

        response = self.client.patch(url, json_update_emprunt, format='json')


        self.assertContains(response, self.site2.id, status_code=status.HTTP_200_OK)
        self.assertEqual(response.data["Data"]['Destination'], 'Paris')
        self.assertEqual(response.data["Data"]['Id'], self.emprunt1.id)

    def test_partial_update_as_conducteur(self):
        """
        On vérifie qu'un utilisateur peut màj un emprunt si il en est conducteur
        """
        self.client.force_login(self.user1)

        json_update_emprunt = {  
            'Destination': 'Paris',
            'Site':  {'Id': self.site2.id},
        }
        url = reverse('emprunt-detail', args=[self.emprunt1.id])
        response = self.client.patch(url, json_update_emprunt, format='json')

        self.assertContains(response, self.site2.id, status_code=status.HTTP_200_OK)
        self.assertEqual(response.data["Data"]['Destination'], 'Paris')
        self.assertEqual(response.data["Data"]['Id'], self.emprunt1.id)

    def test_partial_update_should_throw_401(self):
        json_update_emprunt = {  
            'Destination': 'Paris',
            'Site':  {'Id': self.site2.id},
        }
        url = reverse('emprunt-detail', args=[self.emprunt1.id])

        response = self.client.patch(url, json_update_emprunt, format='json')

        self.assertTemplateNotUsed(response, self.CONST_EMPRUNT_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_partial_update_should_throw_403(self):
        """
        On vérifie qu'un utilisateur ne peut PAS màj un emprunt si il n'est NI autorisé, NI conducteur
        """
        self.client.force_login(self.user1) # Cet utilisateur est passagers mais pas conducteur

        json_update_emprunt = {  
            'Destination': 'Paris',
            'Site':  {'Id': self.site2.id},
        }
        url = reverse('emprunt-detail', args=[self.emprunt2.id])
        response = self.client.patch(url, json_update_emprunt, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    # Destroy tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_destroy(self):
        self.client.force_login(self.admin)

        url = reverse('emprunt-detail', args=[self.emprunt1.id])

        # On ajoute la permission
        perm = Permission.objects.get(codename="emprunt_destroy")
        self.admin.user_permissions.add(perm)

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Emprunt.objects.filter(id__exact=self.emprunt1.id))

    def test_destroy_should_throw_401(self):
        url = reverse('emprunt-detail', args=[self.emprunt1.id])
        response = self.client.delete(url)

        self.assertTemplateNotUsed(response, self.CONST_EMPRUNT_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_destroy_should_throw_403(self):
        self.client.force_login(self.user1)

        url = reverse('emprunt-detail', args=[self.emprunt1.id])
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_should_throw_404(self):
        self.client.force_login(self.admin)

        url = reverse('emprunt-detail', args=[-1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
