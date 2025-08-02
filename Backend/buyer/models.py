from django.db import models
from django.contrib.auth.models import User

PRODUCT_CHOICES = [
    ('plastic', 'Plastic'),
    ('metal', 'Metal'),
    ('paper', 'Paper'),
    ('glass', 'Glass'),
]

REQUEST_STATUS = [
    ('open', 'Open'),
    ('closed', 'Closed'),
]

class BuyerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    state = models.CharField(max_length=100)
    municipality = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"Buyer: {self.user.username}"

class BuyerRequest(models.Model):
    buyer = models.ForeignKey(BuyerProfile, on_delete=models.CASCADE, related_name="requests")
    product = models.CharField(max_length=20, choices=PRODUCT_CHOICES)
    quantity = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=REQUEST_STATUS, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    state = models.CharField(max_length=100)
    municipality = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.product} request by {self.buyer.user.username}"

class AcceptedOffer(models.Model):
    request = models.OneToOneField('BuyerRequest', on_delete=models.CASCADE)
    offer = models.OneToOneField('seller.Offer', on_delete=models.CASCADE)
    accepted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Accepted offer for {self.request.product} by {self.offer.seller.username}"
