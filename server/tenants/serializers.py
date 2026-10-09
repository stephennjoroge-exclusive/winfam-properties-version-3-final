from rest_framework import serializers
from .models import Tenant

class TenantSerializer(serializers.ModelSerializer):
    property_name = serializers.SerializerMethodField()
    unit_number = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    rent_status = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()
    rent = serializers.SerializerMethodField()

    class Meta:
        model = Tenant
        fields = ['id', 'property_obj', 'unit', 'property_name', 'unit_number', 'full_name', 'first_name', 'last_name', 'rent', 'rent_status', 'id_number',
                  'phone', 'move_in_date', 'balance',  'created_at', 'updated_at']

    def validate_unit(self, unit):
        if self.instance and self.instance.unit_id == unit.id:
            return unit

        if unit.unit_status == 'occupied':
            raise serializers.ValidationError('Unit Already Exists')

        return unit

    def get_property_name(self, obj):
        return f"{obj.property_obj.landlord.first_name} {obj.property_obj.landlord.last_name}"

    def get_unit_number(self, obj):
        return f"{obj.unit.unit_number}"

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_rent(self, obj):
        rent = obj.payments.all().first()
        return rent.rent if rent else 0

    def get_rent_status(self, obj):
        status = obj.payments.all().first()
        return status.rent_status if status else None

    def get_balance(self, obj):
       payment = obj.payments.order_by('-date').first()
       if payment is None:
           return 0
       return payment.rent_payable - payment.rent
