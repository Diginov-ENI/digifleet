# Serializers MUST be imported here
# See https://docs.djangoproject.com/en/3.1/topics/db/models/#organizing-models-in-a-package

from .serializer_utilisateur import UtilisateurSerializer
from .serializer_site import SiteSerializer
from .serializer_permission import PermissionSerializer
from .serializer_permission_type import PermissionTypeSerializer
from .serializer_group import GroupSerializer
from .serializer_emprunt import EmpruntSerializer
from .serializer_vehicule import VehiculeSerializer
