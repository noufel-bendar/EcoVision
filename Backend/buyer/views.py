from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from .models import BuyerRequest, BuyerProfile
from .serializers import BuyerRequestSerializer

from seller.models import Offer
from seller.serializers import OfferSerializer  


class BuyerRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing buyer requests.
    Handles CRUD operations for buyer recycling requests.
    """
    serializer_class = BuyerRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Get buyer requests for the authenticated user.
        Creates BuyerProfile if it doesn't exist.
        """
        try:
            buyer_profile = BuyerProfile.objects.get(user=self.request.user)
            return BuyerRequest.objects.filter(buyer=buyer_profile)
        except BuyerProfile.DoesNotExist:
            # Create BuyerProfile if it doesn't exist
            from accounts.models import Profile
            try:
                profile = Profile.objects.get(user=self.request.user)
                buyer_profile = BuyerProfile.objects.create(
                    user=self.request.user,
                    state=profile.state,
                    municipality=profile.municipality,
                    phone=''
                )
            except Profile.DoesNotExist:
                # If no profile exists, create with default values
                buyer_profile = BuyerProfile.objects.create(
                    user=self.request.user,
                    state='Alger',
                    municipality='Alger',
                    phone=''
                )
            return BuyerRequest.objects.filter(buyer=buyer_profile)

    def perform_create(self, serializer):
        """
        Create a new buyer request.
        Automatically creates BuyerProfile if it doesn't exist.
        """
        try:
            buyer_profile = BuyerProfile.objects.get(user=self.request.user)
        except BuyerProfile.DoesNotExist:
            # Create BuyerProfile if it doesn't exist
            from accounts.models import Profile
            try:
                profile = Profile.objects.get(user=self.request.user)
                buyer_profile = BuyerProfile.objects.create(
                    user=self.request.user,
                    state=profile.state,
                    municipality=profile.municipality,
                    phone=''
                )
            except Profile.DoesNotExist:
                # If no profile exists, create with default values
                buyer_profile = BuyerProfile.objects.create(
                    user=self.request.user,
                    state='Alger',
                    municipality='Alger',
                    phone=''
                )
        
        # Use the state from the request data, fallback to buyer profile state
        request_state = self.request.data.get('state', buyer_profile.state)
        
        serializer.save(
            buyer=buyer_profile,
            state=request_state,
            municipality=buyer_profile.municipality
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def incoming_offers(request):
    """
    Get incoming offers for the authenticated buyer.
    Creates BuyerProfile if it doesn't exist.
    """
    try:
        buyer_profile = BuyerProfile.objects.get(user=request.user)
    except BuyerProfile.DoesNotExist:
        # Create BuyerProfile if it doesn't exist
        from accounts.models import Profile
        try:
            profile = Profile.objects.get(user=request.user)
            buyer_profile = BuyerProfile.objects.create(
                user=request.user,
                state=profile.state,
                municipality=profile.municipality,
                phone=''
            )
        except Profile.DoesNotExist:
            # If no profile exists, create with default values
            buyer_profile = BuyerProfile.objects.create(
                user=request.user,
                state='Alger',
                municipality='Alger',
                phone=''
            )
    
    offers = Offer.objects.filter(request__buyer=buyer_profile, status="pending")
    serializer = OfferSerializer(offers, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_offer(request, offer_id):
    """
    Accept a seller's offer for a buyer request.
    """
    try:
        buyer_profile = BuyerProfile.objects.get(user=request.user)
        offer = Offer.objects.get(id=offer_id, request__buyer=buyer_profile)
        offer.status = 'accepted'
        offer.save()
        return Response({'detail': 'Offer accepted successfully'}, status=status.HTTP_200_OK)
    except (Offer.DoesNotExist, BuyerProfile.DoesNotExist):
        return Response({'detail': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_offer(request, offer_id):
    """
    Reject a seller's offer for a buyer request.
    """
    try:
        buyer_profile = BuyerProfile.objects.get(user=request.user)
        offer = Offer.objects.get(id=offer_id, request__buyer=buyer_profile)
        offer.status = 'rejected'
        offer.save()
        return Response({'detail': 'Offer rejected successfully'}, status=status.HTTP_200_OK)
    except (Offer.DoesNotExist, BuyerProfile.DoesNotExist):
        return Response({'detail': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def public_requests(request):
    """
    Public endpoint for sellers to view available buyer requests.
    Allows filtering by product type and state.
    """
    try:
        product_type = request.query_params.get('product_type')
        state = request.query_params.get('state')
        
        print(f"Searching for: product_type={product_type}, state={state}")
        
        queryset = BuyerRequest.objects.filter(status='open')
        print(f"Total open requests: {queryset.count()}")
        
        if product_type:
            queryset = queryset.filter(product__iexact=product_type)
            print(f"After product filter: {queryset.count()}")
        if state:
            # Handle state name variations using Q objects
            if state == 'Alger':
                state_query = Q(state__iexact='Alger') | Q(state__iexact='Algiers')
            elif state == 'Algiers':
                state_query = Q(state__iexact='Alger') | Q(state__iexact='Algiers')
            else:
                state_query = Q(state__iexact=state)
            
            queryset = queryset.filter(state_query)
            print(f"After state filter: {queryset.count()}")
            
        print(f"Final results: {queryset.count()}")
        for req in queryset:
            print(f"  - {req.product} ({req.quantity}kg) in {req.state}")
            
        serializer = BuyerRequestSerializer(queryset, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(f"Error in public_requests: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
