# seller/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SellerProfileViewSet, OrderViewSet
from .views import SellerProfileViewSet, OrderViewSet, RewardViewSet
from .views import ClaimedRewardViewSet


router = DefaultRouter()
router.register('profile', SellerProfileViewSet, basename='seller-profile')
router.register('orders', OrderViewSet, basename='order')
router.register('rewards', RewardViewSet, basename='reward')
router.register('claim-reward', ClaimedRewardViewSet, basename='claim-reward')

urlpatterns = [
    path('', include(router.urls)),
]
