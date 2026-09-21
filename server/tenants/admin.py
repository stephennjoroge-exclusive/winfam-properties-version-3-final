from django.contrib import admin
from .models import Tenant

# Register your models here.
class TenantAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'id_number',
                  'phone', 'move_in_date']
    
admin.site.register(Tenant, TenantAdmin)
