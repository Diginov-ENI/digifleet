from rest_framework import permissions

"""
Permissions custom pour un Site
"""
class SitePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ['create', 'update', 'partial_update', 'destroy' ,'archive']:
            return bool(request.user.is_authenticated and request.user.is_superuser)
        elif view.action in ['retrieve', 'list']:
            return bool(request.user.is_authenticated)
        else:
            return False