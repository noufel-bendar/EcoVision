from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from .models import Profile
from .services import AuthService


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            result = AuthService.create_user_with_profile(request.data)
            return Response(result, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            return Response({"error": "Registration failed. Please try again."}, status=500)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            
            result = AuthService.authenticate_user(username, password)
            return Response(result, status=status.HTTP_200_OK)
            
        except ValueError as e:
            return Response({'error': str(e)}, status=400)
        except Exception as e:
            return Response({'error': 'Login failed. Please try again.'}, status=500)
