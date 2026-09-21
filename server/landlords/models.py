from django.db import models

# Create your models here.
class Landlord(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"