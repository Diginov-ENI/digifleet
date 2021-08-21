from rest_framework import permissions
from rest_framework import exceptions
"""
Permissions custom pour un groupe
"""
class PermissionPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == "retrieve":
            return bool(request.user.is_authenticated)
        elif view.action == "list":
            return bool(request.user.is_authenticated)
        else:
            return False

    """
    Exécuté après has_permission
    Authorise la lecture et la modification de son propre profil
    """
    def has_object_permission(self, request, view, obj):
        return True