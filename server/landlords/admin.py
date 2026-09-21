from django.contrib import admin
from .models import Landlord

# Register your models here.
class LandlordAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name']
    
admin.site.register(Landlord, LandlordAdmin)