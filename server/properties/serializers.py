from rest_framework import serializers
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    landlord_name = serializers.SerializerMethodField()
    computed_total_units = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = ['id', 'landlord', 'landlord_name', 'managers', 'location', 'computed_total_units', 'water_rate', 'created_at', 'updated_at']

    def get_landlord_name(self, obj):
        return f"{obj.landlord.first_name} {obj.landlord.last_name}".strip()

    def get_computed_total_units(self, obj):
        return getattr(obj, 'computed_total_units', None)


