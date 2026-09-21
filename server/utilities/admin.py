from django.contrib import admin
from .models import Utility

# Register your models here.
class UtilityAdmin(admin.ModelAdmin):
    list_display = ['property_obj', 'unit', 'item']

    
admin.site.register(Utility, UtilityAdmin)
