# seller/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SellerProfileViewSet, OrderViewSet

router = DefaultRouter()
router.register('profile', SellerProfileViewSet, basename='seller-profile')
router.register('orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]
