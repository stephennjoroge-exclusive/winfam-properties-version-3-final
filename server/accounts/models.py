from django.db import models
from django.contrib.auth.models import BaseUserManager, PermissionsMixin, AbstractBaseUser

# Create your models here.
class BaseManager(BaseUserManager):
    def create(self, email, password=None, **kwargs):
        if email is None:
            raise ValueError('Email not valid')
        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **kwargs):
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)
        return self.create(email, password, **kwargs)

class User(PermissionsMixin, AbstractBaseUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    email = models.CharField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects= BaseManager()
    REQUIRED_FIELDS = ['first_name']
    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email



