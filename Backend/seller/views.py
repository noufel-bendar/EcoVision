from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import SellerProfile, Order
from .serializers import SellerProfileSerializer, OrderSerializer

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
