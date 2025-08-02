from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import BuyerRequest, BuyerProfile
from .serializers import BuyerRequestSerializer

from seller.models import Offer
from seller.serializers import OfferSerializer  


class BuyerRequestViewSet(viewsets.ModelViewSet):
    serializer_class = BuyerRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # استخدام BuyerProfile للوصول إلى الطلبات الخاصة بالمشتري الحالي
        try:
            buyer_profile = BuyerProfile.objects.get(user=self.request.user)
            return BuyerRequest.objects.filter(buyer=buyer_profile)
        except BuyerProfile.DoesNotExist:
            return BuyerRequest.objects.none()

    def perform_create(self, serializer):
        # ربط الطلب بـ BuyerProfile وليس User
        try:
            buyer_profile = BuyerProfile.objects.get(user=self.request.user)
            serializer.save(buyer=buyer_profile)
        except BuyerProfile.DoesNotExist:
            raise ValueError("BuyerProfile not found for this user.")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def incoming_offers(request):
    try:
        buyer_profile = BuyerProfile.objects.get(user=request.user)
        offers = Offer.objects.filter(request__buyer=buyer_profile, status="pending")
        serializer = OfferSerializer(offers, many=True)
        return Response(serializer.data)
    except BuyerProfile.DoesNotExist:
        return Response([], status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_offer(request, offer_id):
    try:
        buyer_profile = BuyerProfile.objects.get(user=request.user)
        offer = Offer.objects.get(id=offer_id, request__buyer=buyer_profile)
        offer.status = 'accepted'
        offer.save()
        return Response({'detail': 'Offer accepted'}, status=status.HTTP_200_OK)
    except (Offer.DoesNotExist, BuyerProfile.DoesNotExist):
        return Response({'detail': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_offer(request, offer_id):
    try:
        buyer_profile = BuyerProfile.objects.get(user=request.user)
        offer = Offer.objects.get(id=offer_id, request__buyer=buyer_profile)
        offer.status = 'rejected'
        offer.save()
        return Response({'detail': 'Offer rejected'}, status=status.HTTP_200_OK)
    except (Offer.DoesNotExist, BuyerProfile.DoesNotExist):
        return Response({'detail': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)
