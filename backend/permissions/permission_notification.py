from rest_framework import permissions
from rest_framework import exceptions
"""
Permissions custom pour un groupe
"""
class NotificationPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if  view.action in ['list','update', 'partial_update']:
            return bool(request.user.is_authenticated)
        else:
            return False

    """
    Exécuté après has_permission
    Authorise la lecture et la modification de son propre profil
    """
    def has_object_permission(self, request, view, obj):
        if view.action in ['update', 'partial_update']:
            return bool(request.user.is_authenticated and obj.utilisateur.id == request.user.id)
        else:
            return True