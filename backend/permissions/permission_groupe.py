from rest_framework import permissions
from rest_framework import exceptions
"""
Permissions custom pour un groupe
"""
class GroupPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("groupe_create")))
        elif view.action == "retrieve":
            return bool(request.user.is_authenticated)
        elif view.action == "list":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("groupe_list")))
        elif view.action == "destroy":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("groupe_destroy")))
        elif view.action == "archive":
            return bool(request.user.is_authenticated)
        elif view.action in ['update', 'partial_update']:
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("groupe_update")))
        else:
            return False

    """
    Exécuté après has_permission
    Authorise la lecture et la modification de son propre profil
    """
    def has_object_permission(self, request, view, obj):
        if view.action == "destroy":
            return bool(request.user.is_authenticated and (request.user.is_superuser or not request.user.groups.filter(id = obj.id).exists()))
        elif view.action in ['update', 'partial_update']:
            return bool(request.user.is_authenticated and (request.user.is_superuser or not request.user.groups.filter(id = obj.id).exists()))
        else:
            return True