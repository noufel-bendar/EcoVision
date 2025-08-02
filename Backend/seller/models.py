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

class Reward(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.title

class ClaimedReward(models.Model):
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE)
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE)
    claimed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.seller.user.username} claimed {self.reward.title}"

class Offer(models.Model):
    request = models.ForeignKey('buyer.BuyerRequest', on_delete=models.CASCADE, related_name='offers')
    seller = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.seller.username}'s offer for {self.request.product}"
