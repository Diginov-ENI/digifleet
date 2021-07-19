from backend.serializers.serializer_permission import PermissionSerializer
from django.contrib.auth.models import Permission,ContentType
from rest_framework import serializers

class PermissionTypeSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id', required=False)
    Name = serializers.CharField(source='model')
    Permissions = serializers.SerializerMethodField()
    # Permissions = PermissionSerializer(source='user_permission', read_only=True, many=True)

    class Meta:
        model = ContentType
        fields = ('Id','Name','Permissions',)

    def get_Permissions(self,obj):
        permissions = Permission.objects.filter(content_type_id = obj.id)
        return PermissionSerializer(permissions,many=True).data
