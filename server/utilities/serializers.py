from rest_framework import serializers
from .models import Utility

class UtilitySerializer(serializers.ModelSerializer):
    property_name = serializers.SerializerMethodField()
    unit_number = serializers.SerializerMethodField()

    class Meta:
        model = Utility
        fields = ['id', 'property_name', 'unit_number', 'item', 'previous_reading', 'current_reading', 'created_at', 'updated_at']

    def get_property_name(self, obj):
        return f'{obj.property_obj.landlord.first_name} {obj.property_obj.landlord.last_name}'

    def get_unit_number(self, obj):
        return f"{obj.unit.unit_number}"

    

