from rest_framework import serializers
from backend.models.model_site import Site

class SiteSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id', read_only=True, required=False)
    Libelle = serializers.CharField(source='libelle', required=True)
    IsActive = serializers.BooleanField(source='is_active', required=False, default=False)

    class Meta:
        model = Site
        fields = (
            'Id', 
            'Libelle', 
            'IsActive',
        )
        extra_kwargs = {
            'Id' : {
                'required' : False,
            },
        }
