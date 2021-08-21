from rest_framework import permissions

"""
Permissions custom pour un Site
"""
class SitePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("site_create")))
        elif view.action in ['list', 'list_availables', 'retrieve']:
            return bool(request.user.is_authenticated)
        elif view.action == "destroy":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("site_destroy")))
        elif view.action in ['update', 'partial_update']:
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("site_update")))
        else:
            return False