from django.db import models
from properties.models import Property
from units.models import Unit

# Create your models here.
class Utility(models.Model):
    class ItemChoice(models.TextChoices):
        WATER = 'water', 'Water'
        ELECTRICITY = 'electricity', 'Electricity'

    property_obj = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="utilities")
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="utilities")
    item = models.CharField(max_length=100, choices=ItemChoice.choices, default=ItemChoice.WATER)
    previous_reading = models.CharField(max_length=100)
    current_reading = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.property_obj} {self.item}"

    @property
    def unit_cost(self):
        if not self.current_reading:
            return 0
        if not self.previous_reading:
            return 0
        try:
            current = float(self.current_reading)
            previous = float(self.previous_reading)
        except:
            return 0

        balance = current - previous
        if balance <= 0:
            return 0
        UNIT_RATE = self.property_obj.water_rate
        
        return balance * UNIT_RATE

            
