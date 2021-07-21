# Views MUST be imported here
# See https://docs.djangoproject.com/en/3.1/topics/db/models/#organizing-models-in-a-package

from .view_utilisateur import UtilisateurViewSet
from .view_site import SiteViewSet
from .view_groupe import GroupeViewSet
from .view_permission import PermissionViewSet
from .view_permission_type import PermissionTypeViewSet
from .view_emprunt import EmpruntViewSet
from .view_vehicule import VehiculeViewSet
