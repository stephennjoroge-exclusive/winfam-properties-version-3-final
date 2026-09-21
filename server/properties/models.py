from django.db import models
from django.contrib.auth.models import User
from landlords.models import Landlord

# Create your models here.
class Property(models.Model):
    landlord = models.ForeignKey(Landlord, on_delete=models.CASCADE, related_name='properties')
    managers = models.CharField(max_length=100, null=True, default='Winfam Properties')
    location = models.CharField(max_length=150, default='Nairobi')
    water_rate = models.IntegerField(default=0, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-landlord']

    def __str__(self):
        return f"{self.landlord}"