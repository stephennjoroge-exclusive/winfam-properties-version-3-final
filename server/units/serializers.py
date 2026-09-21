from rest_framework import serializers
from .models import Unit

class UnitSerializer(serializers.ModelSerializer):
    property_name = serializers.SerializerMethodField()
    rent_status = serializers.SerializerMethodField()
    tenant_name = serializers.SerializerMethodField()
    rent_payable = serializers.SerializerMethodField()

    class Meta:
        model = Unit
        fields = ['id', 'unit_number', 'tenant_name', 'property_obj', 'property_name', 'unit_type', 'unit_build',
                  'rent_amount', 'unit_status', 'rent_payable', 'rent_status', 'created_at', 'updated_at']
              
    def get_property_name(self, obj):
        return f"{obj.property_obj.landlord.first_name} {obj.property_obj.landlord.last_name}"

    def get_rent_status(self, obj):
        latest_payment = obj.payments.order_by('-date').first()
        return latest_payment.rent_status if latest_payment else None
    
    def get_rent_payable(self, obj):
            rent = obj.payments.all().first()
            return rent.rent_payable if rent else 0

    def get_tenant_name(self, obj):
        tenant = obj.tenants.first()

        if not tenant:
            return ''
        return f"{tenant.first_name} {tenant.last_name}"
        