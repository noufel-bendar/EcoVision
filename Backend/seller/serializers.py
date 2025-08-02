from rest_framework import serializers
from .models import SellerProfile, Order
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class SellerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = SellerProfile
        fields = ['id', 'user', 'state', 'municipality', 'total_points']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['seller', 'state', 'municipality', 'price']

    def create(self, validated_data):
        request = self.context['request']
        seller_profile = SellerProfile.objects.get(user=request.user)
        product = validated_data.get('product')
        quantity = validated_data.get('quantity')
        price_per_kg = {
            'plastic': 100,
            'metal': 300,
            'paper': 80,
            'glass': 120,
        }
        price = price_per_kg.get(product, 0) * quantity
        order = Order.objects.create(
            seller=seller_profile,
            state=seller_profile.state,
            municipality=seller_profile.municipality,
            price=price,
            **validated_data
        )
        return order
