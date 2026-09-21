from django.db import models
from tenants.models import Tenant
from units.models import Unit
from properties.models import Property

# Create your models here.
class Payment(models.Model):
    class PaymentMethod(models.TextChoices):
        MPESA = 'mpesa', 'Mpesa'
        EQUITY = 'equity', 'Equity'
        CASH = 'cash', 'Cash'
        NO_PAY = 'no_pay', 'No_pay'

    class RentStatus(models.TextChoices):
        PAID = 'paid', 'Paid'
        OVERDUE = 'overdue', 'Overdue'
        VACANT = 'vacant', 'Vacant'
        CARETAKER = 'caretaker', 'Caretaker'
        PENDING = 'pending', 'Pending'
        PAID_LANDLORD = 'paid_landlord', 'Paid Landlord'

    class CompletionStatus(models.TextChoices):
        OVERDUE = 'overdue', 'Overdue'
        PENDING = 'pending', 'Pending'
        VACANT = 'vacant', 'Vacant'
        COMPLETED = 'completed', 'Completed'

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, related_name='payments')
    tenant_snapshot = models.CharField(max_length=100, null=True, blank=True)
    property_obj = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='payments')
    unit = models.ForeignKey(Unit, on_delete=models.SET_NULL, null=True, related_name='payments')
    rent_payable = models.DecimalField(max_digits=20, decimal_places=2)
    rent = models.DecimalField(max_digits=20, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.MPESA, null=True)
    rent_status = models.CharField(max_length=50, choices=RentStatus.choices, default=RentStatus.OVERDUE)
    balance_brought_forward = models.DecimalField(max_digits=20, decimal_places=2, default=0, blank=True, null=True) 
    balance_carry_forward = models.DecimalField(max_digits=20, decimal_places=2, default=0, blank=True, null=True)
    deposit = models.DecimalField(max_digits=8, decimal_places=2, null=True, default=0, blank=True)
    water = models.DecimalField(max_digits=20, decimal_places=2, null=True, default=0)
    completion = models.CharField(max_length=100, choices=CompletionStatus.choices, default=CompletionStatus.PENDING, null=True)
    date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.tenant and not self.tenant_snapshot:
            first = (self.tenant.first_name or '').title() if self.tenant.first_name else ''
            last = (self.tenant.last_name or '').title() if self.tenant.last_name else ''
            self.tenant_snapshot = f"{first} {last or ''}".strip()

        tenant_first_name = (self.tenant.first_name or '').strip().lower() if self.tenant else ''
        is_caretaker = tenant_first_name == 'caretaker'
        is_vacant = tenant_first_name == 'vac'
        vacant_unit = self.unit and self.unit.unit_status == Unit.UnitStatus.VACANT

        if is_caretaker:
            self.rent_status = self.RentStatus.CARETAKER
            self.completion = self.CompletionStatus.PENDING

        elif is_vacant:
            self.rent_status = self.RentStatus.VACANT
            self.completion = self.CompletionStatus.VACANT

            if self.unit:
                self.unit.unit_status = Unit.UnitStatus.VACANT
                self.unit.save()

        elif vacant_unit and not self.tenant:
            self.rent_status = self.RentStatus.VACANT
            self.completion = self.CompletionStatus.VACANT

        elif self.rent is not None and self.rent_payable is not None and self.rent >= self.rent_payable:
            self.rent_status = self.RentStatus.PAID
            self.completion = self.CompletionStatus.COMPLETED

        elif self.rent is not None and self.rent_payable is not None and self.rent > 0:
            self.rent_status = self.RentStatus.PENDING
            self.completion = self.CompletionStatus.PENDING

        elif self.rent_status == self.RentStatus.OVERDUE:
            self.completion = self.CompletionStatus.OVERDUE

        elif self.rent == 0 and self.rent_payable == 0:
            self.rent_status = self.RentStatus.OVERDUE
            self.completion = self.CompletionStatus.OVERDUE

        else:
            self.rent_status = self.RentStatus.OVERDUE
            self.completion = self.CompletionStatus.OVERDUE

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-date']

    @property
    def completion_progress(self):
        if not self.rent_payable:
            return 0
        if self.rent > self.rent_payable:
            return 100
        
        return round((self.rent / self.rent_payable) * 100)
    
    def __str__(self):
        return f"{self.tenant} - {self.rent}"

