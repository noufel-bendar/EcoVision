# api/models.py
from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    USER_TYPES = (
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    nin = models.CharField(max_length=20, blank=True, null=True)
    state = models.CharField(max_length=50)
    municipality = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username} - {self.user_type}"
