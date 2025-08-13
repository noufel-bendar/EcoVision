# api/models.py
from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    USER_TYPES = (
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=10, choices=USER_TYPES, db_index=True)
    nin = models.CharField(max_length=20, blank=True, null=True, db_index=True)
    state = models.CharField(max_length=50, db_index=True)
    municipality = models.CharField(max_length=50, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['user_type']),
            models.Index(fields=['state', 'municipality']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.user_type}"
