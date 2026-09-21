from django.db import models
from properties.models import Property

# Create your models here.
class Unit(models.Model):
    class UnitType(models.TextChoices):
        SHOP = 'shop', 'Shop'
        SINGLE = 'single', 'Single'
        DOUBLE_ROOM = 'double_room', 'Double room'
        BEDSITTER = 'bedsitter', 'Bedsitter'
        ONE_BEDROOM = 'one_bedroom', 'One bedroom'
        TWO_BEDROOM = 'two_bedroom', 'Two bedroom'

    class UnitBuild(models.TextChoices):
        MABATI = 'mabati', 'Mabati'
        BLOCK = 'block', 'Block'

    class UnitStatus(models.TextChoices):
        VACANT = 'vacant', 'Vacant'
        OCCUPIED = 'occupied', 'Occupied'
        MAINTENANCE = 'maintenance', 'Maintenance'

    unit_number = models.CharField(max_length=20)
    property_obj = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='units')
    unit_type = models.CharField(max_length=30, choices=UnitType.choices)
    unit_build = models.CharField(max_length=20, choices=UnitBuild.choices, default=UnitBuild.BLOCK)
    rent_amount = models.DecimalField(max_digits=20, decimal_places=2)
    unit_status = models.CharField(max_length=20, choices=UnitStatus.choices, default=UnitStatus.OCCUPIED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-unit_number']

    def __str__(self):
        return f"{self.unit_number}"