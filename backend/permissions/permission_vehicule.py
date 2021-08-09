from rest_framework import permissions
from rest_framework import exceptions
"""
Permissions custom pour un Véhicule
"""
class VehiculePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("vehicule_create")))
        elif view.action == "retrieve":
            return True
        elif view.action in ['list', 'list_availables']:
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("vehicule_list")))
        elif view.action == "destroy":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("vehicule_destroy")))
        elif view.action == "archive":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("vehicule_archive")))
        elif view.action in ['update', 'partial_update']:
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("vehicule_update")))
        else:
            return False

    """
    Exécuté après has_permission
    Authorise la lecture et la modification de son propre profil
    """
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        if view.action == 'retrieve':
            return bool(obj == request.user or (request.user.is_superuser or request.user.has_perm("vehicule_retrieve")))
        else:
            return True
