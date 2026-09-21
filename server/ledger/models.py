from django.db import models
from properties.models import Property
from units.models import Unit
from tenants.models import Tenant

# Create your models here.
class LedgerEntry(models.Model):
    class EntryType(models.TextChoices):
        CHARGE = 'charge', 'Rent Charge'        
        PAYMENT = 'payment', 'Payment Received'   
        EXPENSE = 'expense', 'Expense/Repair'     
        WATER = 'water', 'Water Bill'
        DEPOSIT = 'deposit', 'Deposit'
        ADJUSTMENT = 'adjustment', 'Correction'  

    property_obj = models.ForeignKey(Property, on_delete=models.SET_NULL, null=True, related_name='ledger_entries')
    unit = models.ForeignKey(Unit, on_delete=models.SET_NULL, null=True, related_name='ledger_entries')
    tenant = models.ForeignKey(Tenant, on_delete=models.SET_NULL, null=True, related_name='ledger_entries')
    tenant_snapshot = models.CharField(max_length=100) 

    entry_type = models.CharField(max_length=100, choices=EntryType.choices)
    amount = models.DecimalField(max_digits=100, decimal_places=2)
    description = models.CharField(max_length=300, blank=True)   

    reverses = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='reversed_by') 

    date = models.DateField()              
    created_at = models.DateTimeField(auto_now_add=True) 

    class Meta:
        ordering = ['-date', '-created_at']