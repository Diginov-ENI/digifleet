
from backend.serializers.serializer_utilisateur import UtilisateurSerializer
from backend.serializers.serializer_permission import PermissionSerializer
from django.contrib.auth.models import Group, Permission

from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse
from rest_framework import status

from backend.serializers.serializer_group import GroupSerializer, SimpleUtilisateurSerializer
from backend.models.model_utilisateur import Utilisateur


# Create your tests here.
class UtilisateurTestCase(APITestCase):
    CONST_GROUPE_BASE_URL = '/api/groupes/'

    # Setups 
    def setUp(self):
        self.client = APIClient() 
        self.admin = Utilisateur.objects.create(email='admin@email', username='admin', nom='nom', prenom='prenom', is_active=True, is_superuser=True, password='mdp')
        self.user1 = Utilisateur.objects.create(email='user1@email', username='user1', nom='nom', prenom='prenom', is_active=True, is_superuser=False, password='mdp')
        self.user2 = Utilisateur.objects.create(email='user2@email', username='user2', nom='nom', prenom='prenom', is_active=True, is_superuser=False, password='mdp')
        self.user3 = Utilisateur.objects.create(email='user3@email', username='user3', nom='nom', prenom='prenom', is_active=True, is_superuser=False, password='mdp')
        
        self.group_backoffice = Group.objects.create(name='Backoffice')
        self.group_conducteur = Group.objects.create(name='Conducteur')

        
        self.perm1 = Permission.objects.get(codename="utilisateur_create")
        self.perm2 = Permission.objects.get(codename="utilisateur_update")
        
        self.group_backoffice.permissions.set([self.perm1])
        self.group_conducteur.permissions.set([self.perm1])

        self.user1.groups.set([self.group_backoffice])
        self.user2.groups.set([self.group_conducteur])

    # List tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_list(self):
        self.client.force_login(self.user1)

        url = reverse('group-list')
        # On ajoute la permission
        perm = Permission.objects.get(codename="groupe_list")
        self.user1.user_permissions.add(perm)

        response = self.client.get(url)
        self.assertContains(response, self.group_backoffice, status_code=status.HTTP_200_OK)
        self.assertEqual(len(response.data["Data"]), 2)

    def test_list_should_throw_403(self):
        self.client.force_login(self.user1)

        url = reverse('group-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

    # Retrieve tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_retrieve(self):
        self.client.force_login(self.user1)

        serializer = GroupSerializer(self.group_backoffice)
        url = reverse('group-detail', args=[self.group_backoffice.id])

        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["Data"], serializer.data)    
        self.assertEqual(len(response.data["Data"]["Utilisateurs"]), 1)
        self.assertEqual(len(response.data["Data"]["Permissions"]), 1)

    def test_retrieve_should_throw_404(self):
        self.client.force_login(self.user1)

        url = reverse('group-detail', args=[-1])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Create tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_create(self):
        self.client.force_login(self.user1)

        json_new_groupe = {  
            'Name': 'newGroupe',
            'Permissions':[]
        }
        url = reverse('group-list')
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="groupe_create")
        self.user1.user_permissions.add(perm)

     
        response = self.client.post(url, json_new_groupe, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["Data"]['Name'], 'newGroupe')
        self.assertIsNot(response.data["Data"]['Id'], None)

    def test_create_should_throw_403(self):
        self.client.force_login(self.user1)

        json_new_groupe = {  
            'Name': 'newGroupe',
        }
        url = reverse('group-list')

        response = self.client.post(url, json_new_groupe, format='json')

        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # partial update tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_partial_update(self):
        self.client.force_login(self.user1)

        new_name = 'newGroupeName'
        json_update_group = {  
            'Name': new_name,
        }
        url = reverse('group-detail', args=[self.group_conducteur.id])
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="groupe_update")
        self.user1.user_permissions.add(perm)

        response = self.client.patch(url, json_update_group, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["Data"]['Name'], new_name)
        self.assertEqual(response.data["Data"]['Id'], self.group_conducteur.id)

    def test_partial_update_add_permission(self):
        self.client.force_login(self.user1)

        perm = Permission.objects.get(codename="groupe_update")
        serializerPerm = PermissionSerializer(perm)
        json_update_group = {  
            'Permissions': [serializerPerm.data],
        }
        url = reverse('group-detail', args=[self.group_conducteur.id])
        
        # On ajoute la permission
        self.user1.user_permissions.add(perm)

        response = self.client.patch(url, json_update_group, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["Data"]['Permissions'], [serializerPerm.data])
        self.assertEqual(len(response.data["Data"]['Permissions']), 1)

    def test_partial_update_add_permission_should_throw_403(self):
        self.client.force_login(self.user1)

        perm = Permission.objects.get(codename="groupe_update")
        serializerPerm = PermissionSerializer(perm)
        json_update_group = {  
            'Permissions': [serializerPerm.data],
        }
        url = reverse('group-detail', args=[self.group_backoffice.id])
        
        # On ajoute la permission
        self.user1.user_permissions.add(perm)
        response = self.client.patch(url, json_update_group, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_add_utilisateur(self):
        self.client.force_login(self.user1)

        serializerUser= SimpleUtilisateurSerializer(self.user3)
        json_update_group = {  
            'Utilisateurs': [serializerUser.data],
        }
        url = reverse('group-detail', args=[self.group_conducteur.id])
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="groupe_update")
        self.user1.user_permissions.add(perm)

        response = self.client.patch(url, json_update_group, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["Data"]['Utilisateurs']), 1)
        self.assertEqual(response.data["Data"]['Utilisateurs'][0]['Id'], serializerUser.data['Id'])

    def test_partial_update_add_utilisateur_should_throw_403(self):
        self.client.force_login(self.user1)

        serializerUser= SimpleUtilisateurSerializer(self.user3)
        json_update_group = {  
            'Utilisateurs': [serializerUser.data],
        }
        url = reverse('group-detail', args=[self.group_backoffice.id])
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="groupe_update")
        self.user1.user_permissions.add(perm)

        response = self.client.patch(url, json_update_group, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_should_throw_403(self):
        self.client.force_login(self.user1)

        new_name = 'newGroupeName'
        json_update_group = {  
            'Name': new_name,
        }
        url = reverse('group-detail', args=[self.group_conducteur.id])

        response = self.client.patch(url, json_update_group, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Destroy tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_destroy(self):
        self.client.force_login(self.user1)

        url = reverse('group-detail', args=[self.group_conducteur.id])

        perm = Permission.objects.get(codename="groupe_destroy")
        self.user1.user_permissions.add(perm)

        # On restest, cette fois ci on a le droit
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Group.objects.filter(id__exact=self.group_conducteur.id))

    def test_destroy_should_throw_403(self):
        self.client.force_login(self.user1)

        url = reverse('group-detail', args=[self.group_conducteur.id])

        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_should_throw_404(self):
        self.client.force_login(self.admin)

        url = reverse('group-detail', args=[-1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)