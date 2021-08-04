from rest_framework import permissions
from rest_framework import exceptions
"""
Permissions custom pour un groupe
"""
class PermissionPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == "retrieve":
            return True
        elif view.action == "list":
            return True
        else:
            return False

    """
    Exécuté après has_permission
    Authorise la lecture et la modification de son propre profil
    """
    def has_object_permission(self, request, view, obj):
        return True