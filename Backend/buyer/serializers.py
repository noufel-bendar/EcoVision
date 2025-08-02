from rest_framework import serializers
from .models import BuyerRequest

class BuyerRequestSerializer(serializers.ModelSerializer):
    buyer = serializers.StringRelatedField(read_only=True) 
    buyer_state = serializers.CharField(source='buyer.state', read_only=True)

    class Meta:
        model = BuyerRequest
        fields = [
            'id',
            'buyer',
            'buyer_state',
            'product',
            'quantity',
            'status',
            'created_at',
            'state',
            'municipality',
        ]
        read_only_fields = ['id', 'buyer', 'buyer_state', 'status', 'created_at', 'municipality']
