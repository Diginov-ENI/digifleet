from django.core.exceptions import FieldError
from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse
from rest_framework import status

from backend.serializers.serializer_site import SiteSerializer
from backend.models.model_site import Site
from backend.models.model_utilisateur import Utilisateur

# Create your tests here.
class SiteTestCase(APITestCase):
    CONST_SITE_BASE_URL = '/api/sites/'

    # Setups 
    def setUp(self):
        self.client = APIClient()
        self.admin = Utilisateur.objects.create(email='admin@email', username='admin', nom='nom', prenom='prenom', is_active=True, is_superuser=True)
        self.admin.set_password("mdp")
        self.admin.save()

        self.site_nantes = Site.objects.create(libelle='ENI Nantes')
        self.site_rennes = Site.objects.create(libelle='ENI Rennes')

    # List tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_list(self):
        self.client.force_login(self.admin)

        url = reverse('site-list')

        response = self.client.get(url)

        self.assertContains(response, self.site_nantes.libelle, status_code=status.HTTP_200_OK)
        self.assertEqual(len(response.data['Data']), 2)

    def test_list_should_throw_401(self):
        url = reverse('site-list')

        response = self.client.get(url)

        self.assertTemplateNotUsed(response, self.CONST_SITE_BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Retrieve tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_retrieve(self):
        self.client.force_login(self.admin)

        serializer = SiteSerializer(self.site_nantes)
        url = reverse('site-detail', args=[self.site_nantes.id])

        response = self.client.get(url)        

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Data'], serializer.data)

    def test_retrieve_should_throw_404(self):
        self.client.force_login(self.admin)

        url = reverse('site-detail', args=[-1])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Create tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_create(self):
        self.client.force_login(self.admin)

        json_new_site = {  
            'Libelle': 'ENI Niort',
        }
        url = reverse('site-list')

        response = self.client.post(url, json_new_site, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['Data']['Libelle'], 'ENI Niort')
        self.assertIsNot(response.data['Data']['Id'], None)

    def test_create_should_throw_invalid_serializer(self):
        self.client.force_login(self.admin)

        json_new_site = {  
            'name': 'ENI Niort', # Wrong field
        }
        url = reverse('site-list')

        response = self.client.post(url, json_new_site, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_should_throw_unicity_constraint(self):
        self.client.force_login(self.admin)

        json_existing_site = {  
            'Libelle': 'ENI Nantes',
        }
        url = reverse('site-list')

        response = self.client.post(url, json_existing_site, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['IsSuccess'], False)

    # update tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_update(self):
        self.client.force_login(self.admin)

        new_libelle = 'newLibelle'
        json_update_site = {  
            'Libelle': new_libelle,
        }
        url = reverse('site-detail', args=[self.site_nantes.id])

        response = self.client.put(url, json_update_site, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Data']['Libelle'], new_libelle)
        self.assertEqual(response.data['Data']['Id'], self.site_nantes.id)
    
    # Destroy tests ---------------------------------------------------------------------------------------------------------------------------------------------------------
    def test_destroy(self):
        self.client.force_login(self.admin)

        url = reverse('site-detail', args=[self.site_nantes.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Site.objects.filter(id__exact=self.site_nantes.id))

    def test_destroy_should_throw_404(self):
        self.client.force_login(self.admin)

        url = reverse('site-detail', args=[-1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
