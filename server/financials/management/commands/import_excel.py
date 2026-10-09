from django.core.management.base import BaseCommand
import pandas as pd
from tenants.models import Tenant
from units.models import Unit
from financials.models import Payment
from properties.models import Property
from landlords.models import Landlord
import os, glob
from datetime import datetime

import re


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            '--folder',
            type=str,
            help = "Path to the .xlsx file to import."
        )
    
    def handle(self, *args, **kwargs):
        def split_name(name):
            if pd.isna(name) or not str(name).strip():
                return '', ''
    
            full_name = str(name).lower().strip().split()
            first_name = full_name[0]
            last_name = ' '.join(full_name[1:]) if len(full_name) > 1 else ''
            return first_name, last_name

        def header_fix(file):
            for i in range(5):
                df = pd.read_excel(file, header=i)
                df.columns = df.columns.str.lower().str.replace(r'\s+', '', regex=True)

                keywords = ['name', 'names', 'unit', 'houseno', 'unitno']

                if any(col in df.columns for col in keywords):
                    return i
            return 0

        def clean_unit(unit):
            if pd.isna(unit):
                return None
            try:
                return (str(int(float(unit))))
            except:
                return str(unit).strip()

        def clean_decimal(number):
            if pd.isna(number) or number is None:
                return 0
            try:
                return float(number)
            except (TypeError, ValueError):
                return 0
            

        column_map = {
            "tenant_name": ["name", "names", "tenant name", "client name", "occupant"],
            "unit_number": ["house no", "house number", "unit", "unit no", "houseno"],
            "rent": ["rent", "monthly rent"],
            "rent_payable": ["rent payable", "rent due", "amount due"],
            "balance_bf": ["balance (b/f)", "bal b/f", "balance bf", "balb/f"],
            "balance_cf": ["balance (c/f)", "bal c/f", "balance cf", "balc/f"],
            "deposit": ["deposit", "deposits"],
            "water": ["water", "water bill"],
        }

        fixed_columns = {}

        for col, rows in column_map.items():
            for row in rows:
                fixed_columns[row] = col
        
        folder = kwargs['folder']
        self.stdout.write(self.style.SUCCESS(f"{folder} found..."))

        excel_files = glob.glob(os.path.join(folder, '*.xlsx'))
        excel_files += glob.glob(os.path.join(folder, '*.xls'))

    
        for file in excel_files:
            try:
                if os.path.basename(file).startswith('~$'):
                    continue
                if 'estimate' in os.path.basename(file).lower():
                    continue

                name = os.path.basename(file)
                full_name = os.path.splitext(name)[0].title()

                clean_name = re.sub(r'\(.*?\)','', str(full_name)).strip()
                bracket_match = re.search(r'\((.*?)\)', full_name)
                property_location = bracket_match.group(1).strip() if bracket_match else ''
                landlord_name = re.sub(r'(?i)(jan\w*|feb\w*|mar\w*|apr\w*|may\w*|jun\w*|jul\w*|aug\w*|sep\w*|oct\w*|nov\w*|dec\w*|estimate|`|\([^)]*\))\s+\d{2,4}$', '', clean_name).strip()

                if property_location:
                    landlord_name = f"{landlord_name} {property_location}".strip()
                
                month_match = re.search(r'(?i)(jan\w*|feb\w*|mar\w*|apr\w*|may\w*|jun\w*|jul\w*|aug\w*|sep\w*|oct\w*|nov\w*|dec\w*)\s+(\d{2,4})$', clean_name)

                if month_match:
                    month_str = month_match.group(1).strip()
                    year_str = month_match.group(2)

                    if month_str.lower().startswith('sept'):
                        month_str = 'Sep'

                    if len(year_str) == 2:
                        year_str = '20' + year_str

                    try:
                        payment_date = datetime.strptime(f"01 {month_str} {year_str}", '%d %B %Y').date()
                    except ValueError:
                        payment_date = datetime.strptime(f"01 {month_str} {year_str}", '%d %b %Y').date()
                else:
                    continue

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"File not found: Error{e}"))
                continue
            
            first_landlord_name, last_landlord_name = split_name(landlord_name)
            header_row = header_fix(file)
            if header_row is None:
                header_row = 0

            df = pd.read_excel(file, header=header_row)
            df.columns = df.columns.str.strip().str.lower()
            df.rename(columns=fixed_columns, inplace=True)

            imported_rows = 0
            for _, row in df.iterrows():
                unit_no = row.get('unit_number')
                tenant_name = row.get('tenant_name')
                rent_payable = row.get('rent_payable')
                balance_bf = row.get('balance_bf')
                rent = row.get('rent')
                balance_cf = row.get('balance_cf')
                deposit = row.get('deposit')
                water = row.get('water')

                try:
                    landlord, landlord_created = Landlord.objects.get_or_create(
                        first_name = first_landlord_name or '',
                        last_name = last_landlord_name or '',
                    )
                    landlord_status = 'Landlord Created: ' if landlord_created else 'Landlord Already Exists: '
                    self.stdout.write(self.style.SUCCESS(f"{landlord_status} -> {row['tenant_name'] or ''}"))

                    property_obj, property_created = Property.objects.get_or_create(
                        landlord = landlord,
                        location = property_location,
                    )
                    property_status = 'Property Created: ' if property_created else 'Property Already Exists: '
                    self.stdout.write(self.style.SUCCESS(f"{property_status}"))

                    unit_no = clean_unit(unit_no)
                    if not unit_no:
                        continue
                    
                    unit, unit_created = Unit.objects.get_or_create(
                        unit_number = unit_no,
                        property_obj = property_obj,
                        defaults={
                            'rent_amount' : clean_decimal(rent_payable)
                        }
                    )
                    unit_status = 'Unit Created: ' if unit_created else 'Unit Already Exists: '
                    self.stdout.write(self.style.SUCCESS(f"{unit_status} -> {row['unit_number'] or ''}"))

                    first_tenant_name, last_tenant_name = split_name(tenant_name)
                    tenant, tenant_created = Tenant.objects.get_or_create(
                        property_obj = property_obj,
                        unit = unit,
                        first_name = first_tenant_name or '',
                        last_name = last_tenant_name or ''
                    )
                    tenant_status = 'Tenant Created: ' if tenant_created else 'Tenant Already Exists: '
                    self.stdout.write(self.style.SUCCESS(f"{tenant_status} ->  {tenant_name}"))

                    payment, payment_created = Payment.objects.get_or_create(
                        property_obj = property_obj,
                        tenant = tenant,
                        unit = unit, 
                        date = payment_date,
                        defaults={
                            'rent_payable': clean_decimal(rent_payable),
                            'rent': clean_decimal(rent),
                            'balance_brought_forward': clean_decimal(balance_bf),
                            'balance_carry_forward': clean_decimal(balance_cf),
                            'deposit': clean_decimal(deposit),
                            'water': clean_decimal(water)
                        }
                    )
                    payment_status = 'Payment Created: ' if payment_created else 'Payment Already Exists: '
                    self.stdout.write(self.style.SUCCESS(f"{payment_status} ->  {rent}"))

                    imported_rows += 1
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error: {e}"))
            self.stdout.write(self.style.SUCCESS(f"Done: {imported_rows} found..."))

        