from django.db import models
from properties.models import Property
from units.models import Unit

# Create your models here.
class Tenant(models.Model):
    property_obj = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='tenants')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='tenants')
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30, null=True, blank=True, default='')
    id_number = models.IntegerField(null=True, blank=True)
    phone = models.IntegerField(null=True, blank=True)
    move_in_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    # profile_scan = models.ImageField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name}"