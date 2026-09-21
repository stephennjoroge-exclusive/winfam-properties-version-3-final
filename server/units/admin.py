from django.contrib import admin
from .models import Unit

# Register your models here.
class UnitAdmin(admin.ModelAdmin):
    list_display = ['unit_number', 'property_obj', 'unit_type', 'unit_build',
                  'rent_amount', 'unit_status']

admin.site.register(Unit, UnitAdmin)