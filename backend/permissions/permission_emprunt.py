from rest_framework import permissions

"""
Permissions custom pour une Emprunt
"""
class EmpruntPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("emprunt_create")))
        elif view.action == "retrieve":
            return bool(request.user.is_authenticated)
        elif view.action == "list":
            return bool(request.user.is_authenticated and (request.user.is_superuser or request.user.has_perm("emprunt_list")))
        elif view.action == "list_by_owner":
            return bool(request.user.is_authenticated)
        elif view.action == "destroy":
            return bool(request.user.is_authenticated)
        if view.action in ['update', 'partial_update']:
            return bool(request.user.is_authenticated)
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
            return bool(obj.conducteur == request.user or request.user in obj.passagers.all() or (request.user.is_superuser or request.user.has_perm("emprunt_retrieve")))
        if view.action == 'list_by_owner':
            return bool(obj.conducteur == request.user or (request.user.is_superuser or request.user.has_perm("emprunt_list")))
        if view.action == 'destroy':
            return bool((obj.conducteur == request.user and obj.statut == 'DEPOSEE') or (request.user.is_superuser or request.user.has_perm("emprunt_destroy")))
        if view.action in ['update', 'partial_update']:
            return bool(obj.conducteur == request.user or (request.user.is_superuser or request.user.has_perm("emprunt_update") or request.user.has_perm("emprunt_update_status")))
        else:
            return True