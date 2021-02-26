from rest_framework import permissions

# Permissions custom pour un Utilisateur
class UtilisateurPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ['create', 'list', 'destroy' ,'archive']:
            return bool(request.user.is_authenticated and request.user.is_superuser)
        elif view.action in ['retrieve','update', 'partial_update']:
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        if view.action in ['retrieve', 'update', 'partial_update']:
            return bool(obj == request.user or request.user.is_superuser)
        else:
            return False

# TODO : finish it - do NOT use as
class isOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `owner`.
        return obj.owner == request.user