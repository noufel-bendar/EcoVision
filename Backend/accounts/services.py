"""
Optimized authentication services for better performance
"""
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction
from django.core.cache import cache
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile


class AuthService:
    """Optimized authentication service"""
    
    @staticmethod
    def create_user_with_profile(data):
        """Create user and profile in a single optimized transaction"""
        required_fields = [
            'username', 'password', 'email',
            'first_name', 'last_name', 'state',
            'municipality', 'userType'
        ]

        # Validate required fields
        for field in required_fields:
            if not data.get(field):
                raise ValueError(f"Missing required field: {field}")

        if data.get('userType') == 'buyer' and not data.get('nin'):
            raise ValueError("NIN is required for buyers")

        # Check username existence using cache first
        cache_key = f"username_exists_{data['username']}"
        username_exists = cache.get(cache_key)
        
        if username_exists is None:
            username_exists = User.objects.filter(username=data['username']).exists()
            cache.set(cache_key, username_exists, 300)  # Cache for 5 minutes
        
        if username_exists:
            raise ValueError("Username already exists")

        # Use database transaction for atomicity
        with transaction.atomic():
            # Create user
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                first_name=data['first_name'],
                last_name=data['last_name']
            )

            # Create profile
            profile = Profile.objects.create(
                user=user,
                user_type=data['userType'],
                state=data['state'],
                municipality=data['municipality'],
                nin=data['nin'] if data['userType'] == 'buyer' else None
            )

            # Create specific profile based on user type
            if data['userType'] == 'seller':
                from seller.models import SellerProfile
                SellerProfile.objects.create(
                    user=user,
                    state=data['state'],
                    municipality=data['municipality'],
                    total_points=0
                )
            elif data['userType'] == 'buyer':
                from buyer.models import BuyerProfile
                BuyerProfile.objects.create(
                    user=user,
                    state=data['state'],
                    municipality=data['municipality'],
                    phone=''
                )

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Cache user profile for faster subsequent access
        cache_key = f"user_profile_{user.id}"
        cache.set(cache_key, {
            'user_type': profile.user_type,
            'username': user.username,
            'state': profile.state,
            'municipality': profile.municipality
        }, 600)  # Cache for 10 minutes

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_type': profile.user_type,
            'username': user.username,
        }

    @staticmethod
    def authenticate_user(username, password):
        """Optimized user authentication with caching"""
        if not username or not password:
            raise ValueError('Please provide both username and password')

        # Try to get user from cache first
        cache_key = f"user_auth_{username}"
        cached_user_data = cache.get(cache_key)
        
        if cached_user_data:
            # Verify password against cached data
            user = authenticate(username=username, password=password)
            if user:
                return cached_user_data

        # If not in cache, authenticate normally
        user = authenticate(username=username, password=password)
        if user is None:
            raise ValueError('Invalid credentials')

        # Get or create profile data
        try:
            profile = Profile.objects.select_related('user').get(user=user)
            user_data = {
                'refresh': str(RefreshToken.for_user(user)),
                'access': str(RefreshToken.for_user(user).access_token),
                'username': user.username,
                'user_type': profile.user_type,
            }
            
            # Cache the user data
            cache.set(cache_key, user_data, 300)  # Cache for 5 minutes
            
            return user_data
            
        except Profile.DoesNotExist:
            raise ValueError('User profile not found')

    @staticmethod
    def get_user_profile(user_id):
        """Get user profile with caching"""
        cache_key = f"user_profile_{user_id}"
        profile_data = cache.get(cache_key)
        
        if profile_data is None:
            try:
                profile = Profile.objects.select_related('user').get(user_id=user_id)
                profile_data = {
                    'user_type': profile.user_type,
                    'username': profile.user.username,
                    'state': profile.state,
                    'municipality': profile.municipality
                }
                cache.set(cache_key, profile_data, 600)  # Cache for 10 minutes
            except Profile.DoesNotExist:
                return None
        
        return profile_data

    @staticmethod
    def clear_user_cache(user_id, username):
        """Clear user-related cache entries"""
        cache_keys = [
            f"user_profile_{user_id}",
            f"user_auth_{username}",
            f"username_exists_{username}"
        ]
        for key in cache_keys:
            cache.delete(key)
