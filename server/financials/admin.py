from django.contrib import admin
from .models import Payment

# Register your models here.
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['tenant', 'tenant_snapshot', 'property_obj', 'unit', 'rent_payable', 'rent']

admin.site.register(Payment, PaymentAdmin)
