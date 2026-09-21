import random
from django.core.management.base import BaseCommand
from django.db import transaction
from units.models import Unit
from utilities.models import Utility


class Command(BaseCommand):
    help = "Seed Utility (water/electricity) readings for existing units."

    def add_arguments(self, parser):
        parser.add_argument(
            '--items',
            type=str,
            default='water,electricity',
            help="Comma-separated list of items to seed (default: water,electricity)."
        )
        parser.add_argument(
            '--min-usage',
            type=int,
            default=5,
            help="Minimum usage gap between previous and current reading."
        )
        parser.add_argument(
            '--max-usage',
            type=int,
            default=50,
            help="Maximum usage gap between previous and current reading."
        )
        parser.add_argument(
            '--start-reading',
            type=int,
            default=100,
            help="Baseline for the previous_reading when a unit has no prior utility record."
        )
        parser.add_argument(
            '--overwrite',
            action='store_true',
            help="If set, creates a new Utility row even if one already exists for that unit/item."
        )

    def handle(self, *args, **kwargs):
        items = [i.strip() for i in kwargs['items'].split(',') if i.strip()]
        valid_items = {choice[0] for choice in Utility.ItemChoice.choices}
        invalid = [i for i in items if i not in valid_items]
        if invalid:
            self.stdout.write(self.style.ERROR(
                f"Invalid item(s): {invalid}. Valid choices: {sorted(valid_items)}"
            ))
            return

        min_usage = kwargs['min_usage']
        max_usage = kwargs['max_usage']
        start_reading = kwargs['start_reading']
        overwrite = kwargs['overwrite']

        units = Unit.objects.select_related('property_obj').all()
        if not units.exists():
            self.stdout.write(self.style.WARNING("No units found. Seed units first."))
            return

        created_count = 0
        skipped_count = 0

        with transaction.atomic():
            for unit in units:
                for item in items:
                    existing = Utility.objects.filter(unit=unit, item=item).order_by('-updated_at').first()

                    if existing and not overwrite:
                        skipped_count += 1
                        self.stdout.write(
                            f"Skipped (exists): {unit.property_obj} | {unit.unit_number} | {item}"
                        )
                        continue

                    previous_reading = int(existing.current_reading) if existing else start_reading
                    usage = random.randint(min_usage, max_usage)
                    current_reading = previous_reading + usage

                    Utility.objects.create(
                        property_obj=unit.property_obj,
                        unit=unit,
                        item=item,
                        previous_reading=str(previous_reading),
                        current_reading=str(current_reading),
                    )
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(
                        f"Created: {unit.property_obj} | {unit.unit_number} | {item} "
                        f"-> {previous_reading} -> {current_reading}"
                    ))

        self.stdout.write(self.style.SUCCESS(
            f"Done. Created {created_count} utility record(s), skipped {skipped_count}."
        ))
        
import random
from django.core.management.base import BaseCommand
from django.db import transaction
from units.models import Unit
from utilities.models import Utility


class Command(BaseCommand):
    help = "Seed Utility (water/electricity) readings for existing units."

    def add_arguments(self, parser):
        parser.add_argument(
            '--items',
            type=str,
            default='water,electricity',
            help="Comma-separated list of items to seed (default: water,electricity)."
        )
        parser.add_argument(
            '--min-usage',
            type=int,
            default=5,
            help="Minimum usage gap between previous and current reading."
        )
        parser.add_argument(
            '--max-usage',
            type=int,
            default=50,
            help="Maximum usage gap between previous and current reading."
        )
        parser.add_argument(
            '--start-reading',
            type=int,
            default=100,
            help="Baseline for the previous_reading when a unit has no prior utility record."
        )
        parser.add_argument(
            '--overwrite',
            action='store_true',
            help="If set, creates a new Utility row even if one already exists for that unit/item."
        )

    def handle(self, *args, **kwargs):
        items = [i.strip() for i in kwargs['items'].split(',') if i.strip()]
        valid_items = {choice[0] for choice in Utility.ItemChoice.choices}
        invalid = [i for i in items if i not in valid_items]
        if invalid:
            self.stdout.write(self.style.ERROR(
                f"Invalid item(s): {invalid}. Valid choices: {sorted(valid_items)}"
            ))
            return

        min_usage = kwargs['min_usage']
        max_usage = kwargs['max_usage']
        start_reading = kwargs['start_reading']
        overwrite = kwargs['overwrite']

        units = Unit.objects.select_related('property_obj').all()
        if not units.exists():
            self.stdout.write(self.style.WARNING("No units found. Seed units first."))
            return

        created_count = 0
        skipped_count = 0

        with transaction.atomic():
            for unit in units:
                for item in items:
                    existing = Utility.objects.filter(unit=unit, item=item).order_by('-updated_at').first()

                    if existing and not overwrite:
                        skipped_count += 1
                        self.stdout.write(
                            f"Skipped (exists): {unit.property_obj} | {unit.unit_number} | {item}"
                        )
                        continue

                    previous_reading = int(existing.current_reading) if existing else start_reading
                    usage = random.randint(min_usage, max_usage)
                    current_reading = previous_reading + usage

                    Utility.objects.create(
                        property_obj=unit.property_obj,
                        unit=unit,
                        item=item,
                        previous_reading=str(previous_reading),
                        current_reading=str(current_reading),
                    )
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(
                        f"Created: {unit.property_obj} | {unit.unit_number} | {item} "
                        f"-> {previous_reading} -> {current_reading}"
                    ))

        self.stdout.write(self.style.SUCCESS(
            f"Done. Created {created_count} utility record(s), skipped {skipped_count}."
        ))