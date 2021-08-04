from backend.serializers.serializer_group import GroupSerializer
from backend.serializers.serializer_permission import PermissionSerializer
from django.contrib.auth.models import Group, Permission
from django.core.exceptions import FieldError

from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse
from rest_framework import status

from backend.serializers.serializer_utilisateur import UtilisateurSerializer
from backend.models.model_utilisateur import Utilisateur


# Create your tests here.
class UtilisateurTestCase(APITestCase):
    CONST_UTILISATEUR_BASE_URL = '/api/utilisateurs/'

    # Setups 
    def setUp(self):
        self.client = APIClient()
        self.admin = Utilisateur.objects.create(email='admin@email', username='admin', nom='nom', prenom='prenom', is_active=True, is_superuser=True, password='mdp')
        self.user1 = Utilisateur.objects.create(email='user1@email', username='user1', nom='nom', prenom='prenom', is_active=True, is_superuser=False, password='mdp')
        self.user2 = Utilisateur.objects.create(email='user2@email', username='user2', nom='nom', prenom='prenom', is_active=False, is_superuser=False, password='mdp')
        self.user3 = Utilisateur.objects.create(email='user3@email', username='user3', nom='nom', prenom='prenom', is_active=True, is_superuser=False, password='mdp')


        self.group_backoffice = Group.objects.create(name='Backoffice')
        self.group_conducteur = Group.objects.create(name='Conducteur')

        self.perm1 = Permission.objects.get(codename="groupe_create")
        self.perm2 = Permission.objects.get(codename="groupe_update")
        
        self.group_backoffice.permissions.set([self.perm1])

        self.user1.groups.set([self.group_backoffice])
        self.user1.user_permissions.set([self.perm2])
        
        self.user3.groups.set([self.group_backoffice])
        self.user3.user_permissions.set([self.perm2])

        self.admin.set_password("mdp")
        self.admin.save()
        
        self.user1.set_password("mdp")
        self.user1.save()
        
        self.user2.set_password("mdp")
        self.user2.save()

        
        self.user3.set_password("mdp")
        self.user3.save()

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

        url = reverse('utilisateur-list')

        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_list")
        self.user1.user_permissions.add(perm)

        response = self.client.get(url)
        self.assertContains(response, self.user1, status_code=status.HTTP_200_OK)
        self.assertEqual(len(response.data["Data"]), 4)

    def test_list_should_throw_401(self):
        url = reverse('utilisateur-list')
        response = self.client.get(url)

        self.assertTemplateNotUsed(response, self.CONST_UTILISATEUR_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_should_throw_403(self):
        self.client.force_login(self.user1)

        url = reverse('utilisateur-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

    # Retrieve tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_retrieve(self):
        """
        On vérifie qu'un utilisateur superuser peux visualiser un autre utilisateur
        """
        self.client.force_login(self.admin)

        serializer = UtilisateurSerializer(self.user1)
        url = reverse('utilisateur-detail', args=[self.user1.id])

        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["Data"], serializer.data)
        self.assertEqual(len(response.data["Data"]["Groups"]), 1)
        self.assertEqual(len(response.data["Data"]["UserPermissions"]), 2)
        self.assertEqual(len(response.data["Data"]["DirectUserPermissions"]), 1)

    def test_retrieve_self(self):
        """
        On vérifie qu'un utilisateur peux se visualiser lui-même
        """
        self.client.force_login(self.user1)

        serializer = UtilisateurSerializer(self.user1)
        url = reverse('utilisateur-detail', args=[self.user1.id])

        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["Data"], serializer.data)

    def test_retrieve_other(self):
        """
        On vérifie qu'un utilisateur peux visualiser un autre utilisateur si il en possède la permission
        """
        self.client.force_login(self.user1)

        serializer = UtilisateurSerializer(self.user2)
        url = reverse('utilisateur-detail', args=[self.user2.id])  
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_retrieve")
        self.user1.user_permissions.add(perm)

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["Data"], serializer.data)

    def test_retrieve_should_throw_401(self):
        url = reverse('utilisateur-detail', args=[self.admin.id])
        response = self.client.get(url)  

        self.assertTemplateNotUsed(response, self.CONST_UTILISATEUR_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_should_throw_403(self):
        """
        On vérifie qu'un utilisateur sans droit spécifique ne peux pas visualiser un autre utilisateur
        """
        self.client.force_login(self.user1)

        url = reverse('utilisateur-detail', args=[self.user2.id])
        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_retrieve_should_throw_401(self):
        url = reverse('utilisateur-detail', args=[self.admin.id])
        response = self.client.get(url)  

        self.assertTemplateNotUsed(response, self.CONST_UTILISATEUR_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_should_throw_403(self):
        """
        On vérifie qu'un utilisateur sans droit spécifique ne peux pas visualiser un autre utilisateur
        """
        self.client.force_login(self.user1)

        url = reverse('utilisateur-detail', args=[self.user2.id])
        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


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
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_create")
        self.user1.user_permissions.add(perm)

        response = self.client.post(url, json_new_user, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["Data"]['Email'], 'newUser@email')
        self.assertIsNot(response.data["Data"]['Id'], None)

    def test_create_should_throw_401(self):
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

        self.assertTemplateNotUsed(response, self.CONST_UTILISATEUR_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_should_throw_403(self):
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

    def test_create_should_throw_401(self):
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

        self.assertTemplateNotUsed(response, self.CONST_UTILISATEUR_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_should_throw_403(self):
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

        response = self.client.post(url, json_existing_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['IsSuccess'], False)

    # partial update tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_partial_update(self):
        self.client.force_login(self.user1)
        
        new_name = 'newName'
        json_update_user = {  
            'Nom': new_name,
        }
        url = reverse('utilisateur-detail', args=[self.user2.id])
        
        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_update")
        self.user1.user_permissions.add(perm)

        response = self.client.patch(url, json_update_user, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["Data"]['Nom'], new_name)
        self.assertEqual(response.data["Data"]['Email'], self.user2.email)
        self.assertEqual(response.data["Data"]['Id'], self.user2.id)

    def test_partial_update_permission(self):
        self.client.force_login(self.user1)

        serializerPermGrp = PermissionSerializer(self.perm1)
        serializerPermGrp2 = PermissionSerializer(self.perm2)

        # On recup la permission à ajouter
        perm3 = Permission.objects.get(codename="groupe_destroy")
        serializerPerm = PermissionSerializer(perm3)

        json_update_user = {  
            'DirectUserPermissions': [serializerPerm.data],
        }
        
        url = reverse('utilisateur-detail', args=[self.user3.id])

        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_update")
        self.user1.user_permissions.add(perm)

        response = self.client.patch(url, json_update_user, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertEqual(len(response.data["Data"]['UserPermissions']), 2)
        self.assertEqual(len(response.data["Data"]['DirectUserPermissions']), 1)
        self.assertEqual(response.data["Data"]['DirectUserPermissions'], [serializerPerm.data])

    def test_partial_update_permission_should_not_update_perm(self):
        self.client.force_login(self.user1)

        serializerPermGrp = PermissionSerializer(self.perm1)
        serializerPermGrp2 = PermissionSerializer(self.perm2)

        # On recup la permission à ajouter
        perm3 = Permission.objects.get(codename="groupe_destroy")
        serializerPerm = PermissionSerializer(perm3)

        json_update_user = {  
            'DirectUserPermissions': [serializerPerm.data],
        }
        
        url = reverse('utilisateur-detail', args=[self.user1.id])

        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_update")
        serializerPermTest = PermissionSerializer(perm)
        self.user1.user_permissions.add(perm)

        response = self.client.patch(url, json_update_user, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertEqual(len(response.data["Data"]['UserPermissions']), 3)
        self.assertEqual(len(response.data["Data"]['DirectUserPermissions']), 2)
        self.assertEqual(response.data["Data"]['DirectUserPermissions'], [serializerPermGrp2.data,serializerPermTest.data])
        self.assertEqual(response.data["Data"]['UserPermissions'], [serializerPermGrp.data,serializerPermGrp2.data,serializerPermTest.data])

    def test_partial_update_groupe(self):
        self.client.force_login(self.user1)

        # On recup la permission à ajouter
        serializerGroup = GroupSerializer(self.group_conducteur)

        json_update_user = {  
            'Groups': [serializerGroup.data],
        }
        
        url = reverse('utilisateur-detail', args=[self.user3.id])

        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_update")
        self.user1.user_permissions.add(perm)

        response = self.client.patch(url, json_update_user, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertEqual(len(response.data["Data"]['UserPermissions']), 1)
        self.assertEqual(len(response.data["Data"]['DirectUserPermissions']), 1)
        self.assertEqual(len(response.data["Data"]['Groups']), 1)
        self.assertEqual(response.data["Data"]['Groups'][0]['Id'], serializerGroup.data['Id'])

    def test_partial_update_groupe_should_not_update_groupe(self):
        self.client.force_login(self.user1)

        # On recup le groupe à ajouter
        serializerGroup = GroupSerializer(self.group_conducteur)

        json_update_user = {  
            'Groups': [serializerGroup.data],
        }
        
        url = reverse('utilisateur-detail', args=[self.user1.id])

        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_update")
        self.user1.user_permissions.add(perm)

        response = self.client.patch(url, json_update_user, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertEqual(len(response.data["Data"]['UserPermissions']), 3)
        self.assertEqual(len(response.data["Data"]['DirectUserPermissions']), 2)
        self.assertEqual(len(response.data["Data"]['Groups']), 1)
        self.assertNotEqual(response.data["Data"]['Groups'][0]['Id'], serializerGroup.data['Id'])
        self.assertEqual(response.data["Data"]['Groups'][0]['Id'], self.group_backoffice.id)

    def test_partial_update_should_throw_401(self):
        """
        On vérifie qu'un utilisateur ne peut PAS 
        """
        new_name = 'newName'
        json_update_user = {  
            'Nom': new_name,
        }
        url = reverse('utilisateur-detail', args=[self.user2.id])

        response = self.client.patch(url, json_update_user, format='json')

        self.assertTemplateNotUsed(response, self.CONST_UTILISATEUR_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_partial_update_should_throw_403(self):
        self.client.force_login(self.user1)

        new_name = 'newName'
        json_update_user = {  
            'Nom': new_name,
        }
        url = reverse('utilisateur-detail', args=[self.user2.id])
        response = self.client.patch(url, json_update_user, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_change_password(self):
        self.client.force_login(self.user1)

        json_update_user_password = {  
            'OldPassword': "mdp",
            'Password': "nouveaumdp",
        }
        url = reverse('auth_change_password',args=[self.user1.id])
        response = self.client.patch(url, json_update_user_password, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        userPasswordChanged = Utilisateur.objects.get(email=self.user1.email)
        self.assertEqual(userPasswordChanged.check_password('nouveaumdp'), True)

    def test_change_password_should_throw_403(self):
        self.client.force_login(self.user1)

        json_update_user_password = {  
            'OldPassword': "mdp",
            'Password': "nouveaumdp"
        }
        url = reverse('auth_change_password',args=[self.admin.id])
        response = self.client.patch(url, json_update_user_password, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        userPasswordChanged = Utilisateur.objects.get(email=self.admin.email)
        self.assertEqual(userPasswordChanged.check_password('nouveaumdp'), False)
    
    # Destroy tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_destroy(self):
        self.client.force_login(self.user1)

        url = reverse('utilisateur-detail', args=[self.user2.id])

        # On ajoute la permission
        perm = Permission.objects.get(codename="utilisateur_destroy")
        self.user1.user_permissions.add(perm)

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Utilisateur.objects.filter(id__exact=self.user2.id))

    def test_destroy_should_throw_403(self):
        self.client.force_login(self.user1)

        url = reverse('utilisateur-detail', args=[self.user2.id])
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_should_throw_401(self):
        url = reverse('utilisateur-detail', args=[self.user2.id])
        response = self.client.delete(url)

        self.assertTemplateNotUsed(response, self.CONST_UTILISATEUR_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_destroy_should_throw_404(self):
        self.client.force_login(self.admin)

        url = reverse('utilisateur-detail', args=[-1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
