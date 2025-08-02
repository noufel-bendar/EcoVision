from django.db import models
from django.contrib.auth.models import User

PRODUCT_CHOICES = [
    ('plastic', 'Plastic'),
    ('metal', 'Metal'),
    ('paper', 'Paper'),
    ('glass', 'Glass'),
]

ORDER_STATUS = [
    ('pending', 'Pending'),
    ('accepted', 'Accepted'),
    ('rejected', 'Rejected'),
]

class SellerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    state = models.CharField(max_length=100)
    municipality = models.CharField(max_length=100)
    total_points = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Seller: {self.user.username}"

class Order(models.Model):
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name="orders")
    buyer_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    product = models.CharField(max_length=20, choices=PRODUCT_CHOICES)
    quantity = models.PositiveIntegerField()
    price = models.FloatField()
    status = models.CharField(max_length=10, choices=ORDER_STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    state = models.CharField(max_length=100, blank=True)
    municipality = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Order for {self.product} ({self.status})"
