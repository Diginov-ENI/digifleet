from rest_framework import permissions
from rest_framework import exceptions
"""
Permissions custom pour un Utilisateur
"""
class UtilisateurPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("utilisateur_create")))
        elif view.action == "retrieve":
            return True
        elif view.action == "list":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("utilisateur_list")))
        elif view.action == "destroy":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("utilisateur_destroy")))
        elif view.action == "archive":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("utilisateur_archive")))
        elif view.action in ['update', 'partial_update']:
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("utilisateur_update")))
        else:
            return False

    """
    Exécuté en appellant check_object_permissions
    S'execute après has_permission
    """
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        if view.action == 'retrieve':
            return bool(obj == request.user or (request.user.is_superuser or request.user.has_perm("utilisateur_retrieve")))
        else:
            return True

class UtilisateurPasswordPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        return bool(obj == request.user)