from django.contrib import admin
from .models import Property

# Register your models here.
class PropertyAdmin(admin.ModelAdmin):
    list_display =  ['id', 'landlord', 'location']
    
admin.site.register(Property, PropertyAdmin)