from rest_framework import serializers
from .models import SellerProfile, Order, Reward, ClaimedReward, Offer
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


class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = ['id', 'title', 'description']


class ClaimedRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClaimedReward
        fields = ['id', 'reward', 'claimed_at']
        read_only_fields = ['claimed_at']

    def create(self, validated_data):
        request = self.context['request']
        seller = SellerProfile.objects.get(user=request.user)
        reward = validated_data['reward']

        # Fixed cost of 100 points for any reward
        required_points = 100
        if seller.total_points < required_points:
            raise serializers.ValidationError("Not enough points.")

        seller.total_points -= required_points
        seller.save()

        return ClaimedReward.objects.create(seller=seller, reward=reward)


class OfferSerializer(serializers.ModelSerializer):  # formerly SellerOfferSerializer
    sellerName = serializers.CharField(source='seller.username', read_only=True)
    product = serializers.CharField(source='request.product', read_only=True)
    quantity = serializers.IntegerField(source='request.quantity', read_only=True)
    region = serializers.CharField(source='request.state', read_only=True)
    
    class Meta:
        model = Offer
        fields = ['id', 'sellerName', 'product', 'quantity', 'region', 'price', 'message', 'status', 'created_at']
