from django.contrib.auth.models import Permission
from django.core.exceptions import FieldError
from django.test.testcases import SerializeMixin
from datetime import datetime    
from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse
from rest_framework import serializers, status

from backend.serializers import UtilisateurSerializer
from backend.models import Utilisateur
from backend.views import UtilisateurViewSet


# Create your tests here.
class UtilisateurTestCase(APITestCase):
    CONST_UTILISATEUR_BASE_URL = '/api/utilisateurs/'

    # Setups 
    def setUp(self):
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

        url = reverse('utilisateur-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_list")
        self.user1.user_permissions.add(perm)

        # On restest, cette fois ci on a le droit
        response = self.client.get(url)
        self.assertContains(response, self.user1, status_code=status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_list_should_throw_401(self):
        url = reverse('utilisateur-list')

        response = self.client.get(url)

        self.assertTemplateNotUsed(response, self.CONST_UTILISATEUR_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Retrieve tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_retrieve(self):
        self.client.force_login(self.user1)

        serializer = UtilisateurSerializer(self.user1)
        url = reverse('utilisateur-detail', args=[self.user1.id])

        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_retrieve_other(self):
        self.client.force_login(self.user1)

        serializer = UtilisateurSerializer(self.admin)
        url = reverse('utilisateur-detail', args=[self.admin.id])

        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_retrieve")
        self.user1.user_permissions.add(perm)

        # On restest, cette fois ci on a le droit
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_retrieve_should_throw_404(self):
        self.client.force_login(self.user1)

        url = reverse('utilisateur-detail', args=[-1])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Create tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_create(self):
        self.client.force_login(self.user1)

        json_new_user = {  
            'Email': 'newUser@email',
            'Username': 'newUser',
            'Nom': 'newUser',
            'Prenom': 'newUser',
            'IsActive': 'True',
            'IsSuperuser': 'False',
        }
        url = reverse('utilisateur-list')

        response = self.client.post(url, json_new_user, format='json')

        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_create")
        self.user1.user_permissions.add(perm)

        # On restest, cette fois ci on a le droit
        response = self.client.post(url, json_new_user, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['Email'], 'newUser@email')
        self.assertIsNot(response.data['Id'], None)

    def test_create_should_throw_invalid_serializer(self):
        self.client.force_login(self.admin)

        json_new_user = {  
            'email': 'newUser@email', # Wrong field
            'Username': 'newUser',
            'Nom': 'newUser',
            'Prenom': 'newUser',
            'IsActive': 'True',
            'IsSuperuser': 'False',
        }
        url = reverse('utilisateur-list')

        response = self.client.post(url, json_new_user, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_should_throw_unicity_constraint(self):
        self.client.force_login(self.admin)

        json_existing_user = {  
            'Email': 'user1@email',
            'Username': 'user1',
            'Nom': 'nom',
            'Prenom': 'prenom',
            'IsActive': 'True',
            'IsSuperuser': 'False',
        }
        url = reverse('utilisateur-list')

        with self.assertRaises(FieldError):
            self.client.post(url, json_existing_user, format='json')

    # partial update tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_partial_update(self):
        self.client.force_login(self.user1)

        new_name = 'newName'
        json_update_user = {  
            'Nom': new_name,
        }
        url = reverse('utilisateur-detail', args=[self.user2.id])

        response = self.client.patch(url, json_update_user, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_update")
        self.user1.user_permissions.add(perm)

        # On restest, cette fois ci on a le droit
        response = self.client.patch(url, json_update_user, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Nom'], new_name)
        self.assertEqual(response.data['Email'], self.user2.email)
        self.assertEqual(response.data['Id'], str(self.user2.id))


    def test_change_password(self):
        self.client.force_login(self.user1)
        url = reverse('auth_change_password',args=[self.user1.id])

        json_update_user_password = {  
            'Password': "nouveaumdp",
            'OldPassword': "mdp",
        }
        response = self.client.patch(url, json_update_user_password, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        userPasswordChanged = Utilisateur.objects.get(email=self.user1.email)
        self.assertEqual(userPasswordChanged.check_password('nouveaumdp'), True)

    def test_change_password_fail(self):
        self.client.force_login(self.user1)
        url = reverse('auth_change_password',args=[self.admin.id])

        json_update_user_password = {  
            'OldPassword': "mdp",
            'Password': "nouveaumdp"
        }
        response = self.client.patch(url, json_update_user_password, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        userPasswordChanged = Utilisateur.objects.get(email=self.admin.email)
        self.assertEqual(userPasswordChanged.check_password('nouveaumdp'), False)
    
    # Destroy tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_destroy(self):
        self.client.force_login(self.user1)

        url = reverse('utilisateur-detail', args=[self.user2.id])

        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_destroy")
        self.user1.user_permissions.add(perm)

        # On restest, cette fois ci on a le droit
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Utilisateur.objects.filter(id__exact=self.user2.id))

    def test_destroy_should_throw_404(self):
        self.client.force_login(self.admin)

        url = reverse('utilisateur-detail', args=[-1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
