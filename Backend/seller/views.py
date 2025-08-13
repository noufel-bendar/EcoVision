from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import SellerProfile, Order, Offer
from .serializers import SellerProfileSerializer, OrderSerializer
from .models import Reward
from .serializers import RewardSerializer
from buyer.models import BuyerRequest

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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_offer(request):
    """
    Create an offer for a buyer request.
    """
    try:
        request_id = request.data.get('request_id')
        price = request.data.get('price')
        message = request.data.get('message', '')
        
        if not request_id or not price:
            return Response(
                {'error': 'request_id and price are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        buyer_request = BuyerRequest.objects.get(id=request_id, status='open')
        
        # Check if seller already made an offer for this request
        existing_offer = Offer.objects.filter(
            request=buyer_request,
            seller=request.user
        ).first()
        
        if existing_offer:
            return Response(
                {'error': 'You have already made an offer for this request'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        offer = Offer.objects.create(
            request=buyer_request,
            seller=request.user,
            price=price,
            message=message
        )
        
        return Response({
            'id': offer.id,
            'request_id': offer.request.id,
            'price': offer.price,
            'message': offer.message,
            'status': offer.status,
            'created_at': offer.created_at
        }, status=status.HTTP_201_CREATED)
        
    except BuyerRequest.DoesNotExist:
        return Response(
            {'error': 'Request not found or not available'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_offers(request):
    """
    Get all offers made by the authenticated seller.
    """
    try:
        offers = Offer.objects.filter(seller=request.user)
        accepted_offers = offers.filter(status='accepted')
        rejected_offers = offers.filter(status='rejected')
        
        accepted_data = []
        for offer in accepted_offers:
            accepted_data.append({
                'id': offer.id,
                'buyerName': offer.request.buyer.user.username,
                'phone': offer.request.buyer.phone or 'N/A',
                'product': offer.request.product,
                'quantity': offer.request.quantity,
                'price': float(offer.price),
                'status': offer.status,
                'created_at': offer.created_at
            })
        
        rejected_data = []
        for offer in rejected_offers:
            rejected_data.append({
                'id': offer.id,
                'buyerName': offer.request.buyer.user.username,
                'phone': offer.request.buyer.phone or 'N/A',
                'product': offer.request.product,
                'quantity': offer.request.quantity,
                'price': float(offer.price),
                'status': offer.status,
                'created_at': offer.created_at
            })
        
        return Response({
            'accepted': accepted_data,
            'rejected': rejected_data
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_sellers(request):
    """
    Get top sellers based on total points.
    """
    try:
        # Get top 5 sellers by total points
        top_sellers = SellerProfile.objects.order_by('-total_points')[:5]
        
        sellers_data = []
        for seller in top_sellers:
            # Calculate total sales from accepted offers
            # Use the correct relationship: Offer.objects.filter(seller=seller.user)
            accepted_offers = Offer.objects.filter(seller=seller.user, status='accepted')
            total_sales = sum(offer.request.quantity for offer in accepted_offers)
            
            sellers_data.append({
                'name': seller.user.username,
                'points': seller.total_points,
                'sales': total_sales,
                'state': seller.state,
                'transactions': accepted_offers.count()
            })
        
        return Response(sellers_data)
        
    except Exception as e:
        print(f"Error in top_sellers: {str(e)}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ensure_seller_profile(request):
    """
    Ensure seller profile exists for the authenticated user.
    """
    try:
        seller_profile = SellerProfile.objects.get(user=request.user)
        return Response({'detail': 'Profile already exists'}, status=status.HTTP_200_OK)
    except SellerProfile.DoesNotExist:
        # Create SellerProfile if it doesn't exist
        from accounts.models import Profile
        try:
            profile = Profile.objects.get(user=request.user)
            seller_profile = SellerProfile.objects.create(
                user=request.user,
                state=profile.state,
                municipality=profile.municipality,
                total_points=0
            )
        except Profile.DoesNotExist:
            # If no profile exists, create with default values
            seller_profile = SellerProfile.objects.create(
                user=request.user,
                state='Alger',
                municipality='Alger',
                total_points=0
            )
        
        return Response({'detail': 'Profile created successfully'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_seller_points(request):
    """
    Debug endpoint to check seller points and transaction history.
    """
    try:
        seller_profile = SellerProfile.objects.get(user=request.user)
        
        # Get all offers by this seller
        all_offers = Offer.objects.filter(seller=request.user)
        accepted_offers = all_offers.filter(status='accepted')
        pending_offers = all_offers.filter(status='pending')
        rejected_offers = all_offers.filter(status='rejected')
        
        # Calculate total sales
        total_sales = sum(offer.request.quantity for offer in accepted_offers)
        
        debug_data = {
            'seller_name': request.user.username,
            'total_points': seller_profile.total_points,
            'total_offers': all_offers.count(),
            'accepted_offers': accepted_offers.count(),
            'pending_offers': pending_offers.count(),
            'rejected_offers': rejected_offers.count(),
            'total_sales_kg': total_sales,
            'expected_base_points': total_sales * 2,
            'expected_bonus_points': min(accepted_offers.count() * 5, 50),
            'expected_total_points': (total_sales * 2) + min(accepted_offers.count() * 5, 50),
            'offers_detail': [
                {
                    'id': offer.id,
                    'status': offer.status,
                    'quantity': offer.request.quantity,
                    'product': offer.request.product,
                    'created_at': offer.created_at
                }
                for offer in all_offers.order_by('-created_at')
            ]
        }
        
        return Response(debug_data)
        
    except SellerProfile.DoesNotExist:
        return Response({'error': 'Seller profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_offer(request, offer_id):
    """
    Delete a seller's offer from their history.
    """
    try:
        offer = Offer.objects.get(id=offer_id, seller=request.user)
        
        # Only allow deletion of accepted or rejected offers (not pending ones)
        if offer.status == 'pending':
            return Response(
                {'error': 'Cannot delete pending offers'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # If the offer was accepted, we need to handle points deduction
        if offer.status == 'accepted':
            try:
                seller_profile = SellerProfile.objects.get(user=request.user)
                
                # Calculate points to deduct
                base_points_per_kg = 2
                quantity = offer.request.quantity
                base_points = quantity * base_points_per_kg
                
                # Calculate bonus points that were awarded
                # We need to count accepted offers before this one was accepted
                previous_accepted_offers = Offer.objects.filter(
                    seller=request.user,
                    status='accepted',
                    created_at__lt=offer.created_at
                ).count()
                bonus_points = min(previous_accepted_offers * 5, 50)
                
                total_points_to_deduct = base_points + bonus_points
                
                # Deduct points
                seller_profile.total_points = max(0, seller_profile.total_points - total_points_to_deduct)
                seller_profile.save()
                
                print(f"Deducted {total_points_to_deduct} points from seller {request.user.username}")
                
            except SellerProfile.DoesNotExist:
                print(f"Seller profile not found for user {request.user.username}")
            except Exception as e:
                print(f"Error deducting points: {str(e)}")
        
        # Delete the offer
        offer.delete()
        
        return Response({'detail': 'Offer deleted successfully'}, status=status.HTTP_200_OK)
        
    except Offer.DoesNotExist:
        return Response(
            {'error': 'Offer not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

