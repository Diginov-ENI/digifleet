from django.contrib.auth.models import Permission,Group
from rest_framework import serializers

class PermissionSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id', required=False)
    Codename = serializers.CharField(source='codename')
    Name = serializers.CharField(source='name')

    class Meta:
        model = Permission
        fields = ('Id','Codename','Name',)
