from rest_framework.routers import DefaultRouter
from .views import BuyerRequestViewSet
from django.urls import path, include
from .views import incoming_offers
from .views import accept_offer, reject_offer, public_requests

router = DefaultRouter()
router.register('requests', BuyerRequestViewSet, basename='buyer-requests')

urlpatterns = [
    path('', include(router.urls)),
    path('incoming-offers/', incoming_offers),
    path('offer/<int:offer_id>/accept/', accept_offer),
    path('offer/<int:offer_id>/reject/', reject_offer),
    path('public-requests/', public_requests),
]
