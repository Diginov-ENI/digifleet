
from backend.serializers.serializer_permission import PermissionSerializer
from backend.serializers.serializer_permission_type import PermissionTypeSerializer
from django.contrib.auth.models import Permission

from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse
from rest_framework import status

from backend.models.model_utilisateur import Utilisateur


# Create your tests here.
class PermissionTestCase(APITestCase):

    # Setups 
    def setUp(self):
        self.client = APIClient() 
        self.admin = Utilisateur.objects.create(email='admin@email', username='admin', nom='nom', prenom='prenom', is_active=True, is_superuser=True, password='mdp')
        self.user1 = Utilisateur.objects.create(email='user1@email', username='user1', nom='nom', prenom='prenom', is_active=True, is_superuser=False, password='mdp')

    # List tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_list(self):
        self.client.force_login(self.user1)

        url = reverse('permission-list')
       
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    # Retrieve tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_retrieve(self):
        self.client.force_login(self.user1)

        perm = Permission.objects.get(codename="utilisateur_list")

        serializer = PermissionSerializer(perm)
        url = reverse('permission-detail', args=[perm.id])

        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)    

   

    # Create tests ---------------------------------------------------------------------------------------------------------------------------------------------------------


    def test_create_should_throw_403(self):
        self.client.force_login(self.user1)
        

        json_new_permission= {  
            'Name': 'newPerm',
        }
        url = reverse('permission-list')

        response = self.client.post(url, json_new_permission, format='json')

        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # partial update tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
   
    
    def test_partial_update_should_throw_403(self):
        self.client.force_login(self.user1)
        perm = Permission.objects.get(codename="utilisateur_list")
        new_name = 'newName'
        json_update_perm = {  
            'Name': new_name,
        }
        url = reverse('permission-detail', args=[perm.id])

        response = self.client.patch(url, json_update_perm, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Destroy tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    

    def test_destroy_should_throw_403(self):
        self.client.force_login(self.user1)
        perm = Permission.objects.get(codename="utilisateur_list")
        url = reverse('permission-detail', args=[perm.id])

        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

   
