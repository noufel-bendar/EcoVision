from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        required_fields = [
            'username', 'password', 'email',
            'first_name', 'last_name', 'state',
            'municipality', 'userType'
        ]

        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"Missing required field: {field}"}, status=400)

        if data.get('userType') == 'buyer' and not data.get('nin'):
            return Response({"error": "NIN is required for buyers"}, status=400)

        if User.objects.filter(username=data['username']).exists():
            return Response({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )

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

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_type': profile.user_type,
            'username': user.username,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide both username and password'}, status=400)

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'error': 'Invalid credentials'}, status=401)

        refresh = RefreshToken.for_user(user)

        try:
            user_type = user.profile.user_type
        except Profile.DoesNotExist:
            user_type = None

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
            'user_type': user_type,
        }, status=status.HTTP_200_OK)
