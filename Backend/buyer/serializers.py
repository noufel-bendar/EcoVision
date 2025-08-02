from rest_framework import serializers
from .models import BuyerRequest
class BuyerRequestSerializer(serializers.ModelSerializer):
    buyer = serializers.StringRelatedField(read_only=True) 

    class Meta:
        model = BuyerRequest
        fields = [
            'id',
            'buyer',
            'product',
            'quantity',
            'status',
            'created_at',
            'state',
            'municipality',
        ]
        read_only_fields = ['id', 'buyer', 'status', 'created_at']
