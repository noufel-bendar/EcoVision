# seller/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SellerProfileViewSet, OrderViewSet, RewardViewSet, ClaimedRewardViewSet, create_offer, my_offers, top_sellers, ensure_seller_profile, debug_seller_points, delete_offer


router = DefaultRouter()
router.register('profile', SellerProfileViewSet, basename='seller-profile')
router.register('orders', OrderViewSet, basename='order')
router.register('rewards', RewardViewSet, basename='reward')
router.register('claim-reward', ClaimedRewardViewSet, basename='claim-reward')

urlpatterns = [
    path('', include(router.urls)),
    path('create-offer/', create_offer, name='create-offer'),
    path('my-offers/', my_offers, name='my-offers'),
    path('top-sellers/', top_sellers, name='top-sellers'),
    path('ensure-profile/', ensure_seller_profile, name='ensure-seller-profile'),
    path('debug-points/', debug_seller_points, name='debug-seller-points'),
    path('delete-offer/<int:offer_id>/', delete_offer, name='delete-offer'),
]
