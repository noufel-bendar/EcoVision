from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import SellerProfile, Order
from .serializers import SellerProfileSerializer, OrderSerializer
from .models import Reward
from .serializers import RewardSerializer

class SellerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = SellerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SellerProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Order.objects.all()
        state = self.request.query_params.get('state')
        product_type = self.request.query_params.get('product_type')

        if state:
            queryset = queryset.filter(seller__state__iexact=state)
        if product_type:
            queryset = queryset.filter(product__iexact=product_type)

        return queryset

    def perform_create(self, serializer):
        seller = SellerProfile.objects.get(user=self.request.user)
        serializer.save(seller=seller)


class RewardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Create sample rewards if none exist
        if not Reward.objects.exists():
            Reward.objects.create(
                title="Free Coffee",
                description="Get a free coffee from any partner café"
            )
            Reward.objects.create(
                title="Discount Voucher",
                description="20% discount on next purchase"
            )
            Reward.objects.create(
                title="Premium Membership",
                description="Access to exclusive deals and offers"
            )
        return Reward.objects.all()

# views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ClaimedReward
from .serializers import ClaimedRewardSerializer

class ClaimedRewardViewSet(viewsets.ModelViewSet):
    queryset = ClaimedReward.objects.all()
    serializer_class = ClaimedRewardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        seller = SellerProfile.objects.get(user=self.request.user)
        return ClaimedReward.objects.filter(seller=seller)

    def perform_create(self, serializer):
        serializer.save()

