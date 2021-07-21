from rest_framework import serializers
from backend.models.model_clef import Clef

class ClefSerializer(serializers.ModelSerializer):
    Id = serializers.IntegerField(source='id', required=False)
    Libelle = serializers.CharField(source='libelle')

    class Meta:
        model = Clef
        fields = ('Id',
                  'Libelle')
