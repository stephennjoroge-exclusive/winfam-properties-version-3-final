from django.core.management.base import BaseCommand
import pandas as pd
from tenants.models import Tenant
from properties.models import Property
from units.models import Unit
import os, glob

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            '--contacts',
            type=str,
            help = 'import contacts..'
        )
    
    def handle(self, *args, **kwargs):
        contacts = kwargs['contacts']
        self.stdout.write(self.style.SUCCESS(f"{contacts} found..."))

        excel_files = glob.glob(os.path.join(contacts, '*.xlsx'))
        excel_files += glob.glob(os.path.join(contacts, '*.xls'))

        for file in excel_files:
            try:
                df = pd.read_excel(file)
                print(df)
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error: {e}"))
                return

            imported_rows = 0
            for _, row in df.iterrows():
                contacts = row.get('contacts')
                try:
                    property_obj = Property.objects.get(property_obj_id=)
                except Property.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"Error: Property does not exist.."))
                    
                try:
                    pass
                except Unit.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"Error: Property does not exist.."))

                try:
                    tenant, tenant_created = Tenant.objects.get_or_create(
                        property
                    )
                    status = 'Contact Created: ' if tenant_created else 'Contact Already Exists: '
                    self.stdout.write(self.style.SUCCESS(f"{status} -> {row['contacts']}"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error: {e}"))
            self.stdout.write(self.style.SUCCESS(f"Done: {imported_rows} found..."))

# from django.core.management.base import BaseCommand
# import pandas as pd
# from tenants.models import Tenant
# from properties.models import Property
# from units.models import Unit
# from landlords.models import Landlord
# import os, glob, re


# class Command(BaseCommand):
#     def add_arguments(self, parser):
#         parser.add_argument('--contacts', type=str, help='Path to folder of contact .xlsx files.')

#     def handle(self, *args, **kwargs):
#         def split_name(name):
#             if pd.isna(name) or not str(name).strip():
#                 return '', ''
#             full_name = str(name).lower().strip().split()
#             return full_name[0], ' '.join(full_name[1:])

#         def clean_unit(unit):
#             if pd.isna(unit):
#                 return None
#             try:
#                 return str(int(float(unit)))
#             except Exception:
#                 return str(unit).strip()

#         def header_fix(file):
#             for i in range(5):
#                 df = pd.read_excel(file, header=i)
#                 df.columns = df.columns.str.lower().str.replace(r'\s+', '', regex=True)
#                 if any(col in df.columns for col in ['name', 'names', 'unit', 'houseno', 'unitno', 'phone', 'contact']):
#                     return i
#             return 0

#         column_map = {
#             "tenant_name": ["name", "names", "tenant name", "client name", "occupant"],
#             "unit_number": ["house no", "house number", "unit", "unit no", "houseno"],
#             "phone": ["phone", "phone number", "contact", "tel", "mobile"],
#             "email": ["email", "email address"],
#         }
#         fixed_columns = {row: col for col, rows in column_map.items() for row in rows}

#         folder = kwargs['contacts']
#         self.stdout.write(self.style.SUCCESS(f"{folder} found..."))

#         excel_files = glob.glob(os.path.join(folder, '*.xlsx')) + glob.glob(os.path.join(folder, '*.xls'))

#         for file in excel_files:
#             if os.path.basename(file).startswith('~$'):
#                 continue

#             name = os.path.splitext(os.path.basename(file))[0].title()
#             landlord_name = re.sub(r'\(.*?\)', '', name).strip()
#             first_landlord_name, last_landlord_name = split_name(landlord_name)

#             try:
#                 landlord = Landlord.objects.get(
#                     first_name=first_landlord_name,
#                     last_name=last_landlord_name,
#                 )
#                 property_obj = Property.objects.get(landlord=landlord)
#             except Landlord.DoesNotExist:
#                 self.stdout.write(self.style.ERROR(f"Landlord not found for file: {name}"))
#                 continue
#             except Property.DoesNotExist:
#                 self.stdout.write(self.style.ERROR(f"Property not found for landlord: {landlord_name}"))
#                 continue
#             except Property.MultipleObjectsReturned:
#                 self.stdout.write(self.style.ERROR(f"Landlord {landlord_name} has multiple properties — skipping {name}"))
#                 continue

#             header_row = header_fix(file)
#             df = pd.read_excel(file, header=header_row)
#             df.columns = df.columns.str.strip().str.lower()
#             df.rename(columns=fixed_columns, inplace=True)

#             imported_rows = 0
#             for _, row in df.iterrows():
#                 unit_no = clean_unit(row.get('unit_number'))
#                 phone = row.get('phone')
#                 email = row.get('email')

#                 if not unit_no:
#                     continue

#                 try:
#                     unit = Unit.objects.get(unit_number=unit_no, property_obj=property_obj)
#                 except Unit.DoesNotExist:
#                     self.stdout.write(self.style.ERROR(f"Unit {unit_no} not found on {landlord_name}'s property"))
#                     continue

#                 try:
#                     tenant = Tenant.objects.get(property_obj=property_obj, unit=unit)
#                 except Tenant.DoesNotExist:
#                     self.stdout.write(self.style.ERROR(f"No tenant on unit {unit_no} to attach contact to"))
#                     continue
#                 except Tenant.MultipleObjectsReturned:
#                     self.stdout.write(self.style.ERROR(f"Multiple tenants on unit {unit_no} — skipping"))
#                     continue

#                 updated = False
#                 if phone and not pd.isna(phone):
#                     tenant.phone = str(phone).strip()
#                     updated = True
#                 if email and not pd.isna(email):
#                     tenant.email = str(email).strip()
#                     updated = True

#                 if updated:
#                     tenant.save()
#                     imported_rows += 1
#                     self.stdout.write(self.style.SUCCESS(f"Contact updated -> {row.get('tenant_name', '')}"))

#             self.stdout.write(self.style.SUCCESS(f"Done: {imported_rows} contacts updated in {name}"))