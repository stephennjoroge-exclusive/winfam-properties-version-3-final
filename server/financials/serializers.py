from rest_framework import serializers
from .models import Payment

class TenantPaymentSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = [
            'id',
            'rent_payable',
            'rent',
            'balance',
            'payment_method',
            'rent_status',
            'date',
        ]

    def get_balance(self, obj):
        if obj.rent_payable is None or obj.rent is None:
            return 0
        return obj.rent_payable - obj.rent 

class PaymentSerializer(serializers.ModelSerializer):
    completion_progress = serializers.ReadOnlyField()
    unit_number_unit = serializers.SerializerMethodField()
    property_name = serializers.SerializerMethodField()
    tenant_name = serializers.SerializerMethodField()
    tenant_payment = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = ['id', 'tenant', 'tenant_snapshot', 'tenant_name', 'property_obj', 'property_name', 'unit_number_unit', 'rent_payable', 
                  'rent', 'balance', 'payment_method', 'rent_status', 'balance_brought_forward', 'balance_carry_forward',
                  'deposit', 'water', 'completion', 'created_at', 'updated_at', 'completion_progress', 'date', 'tenant_payment']
        

    def get_unit_number_unit(self, obj):
        return str(obj.unit.unit_number) if obj.unit else None
    
    def get_property_name(self, obj):
        return f"{obj.property_obj.landlord.first_name} {obj.property_obj.landlord.last_name or ''}"
    
    def get_tenant_name(self, obj):
        return f"{obj.tenant.first_name} {obj.tenant.last_name or ''}"

    def get_tenant_payment(self, obj):
        return TenantPaymentSerializer(
            obj.tenant.payments.all(), many=True
        ).data

    def get_balance(self, obj):
        if obj.rent_payable is None or obj.rent is None:
            return 0
        return obj.rent_payable - obj.rent 

