from django.shortcuts import render
from .models import User
from properties.models import Property
from tenants.serializers import TenantSerializer
from .serializers import *
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.decorators import api_view, permission_classes
import random
from rest_framework_simplejwt.views import TokenRefreshView

# Create your views here.
class UserRegistrationAPIView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        data = serializer.data
        token = RefreshToken.for_user(user)
        data['tokens'] = {'refresh': str(token), 'access': str(token.access_token)}

        return Response(data, status=status.HTTP_201_CREATED)

class UserLoginAPIView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        response_serializer = UserSerializer(user) 
        data = response_serializer.data
        token = RefreshToken.for_user(user)
        data['token'] = {'refresh': str(token), 'access': str(token.access_token)}

        return Response(data, status=status.HTTP_200_OK)


class UserLogoutAPIView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def profile_avatar(request):
    count = int(request.query_params.get('count', 4))
    property_id = list(Property.objects.values_list('id', 'landlord__first_name'))
    sample = random.sample(property_id, min(count, len(property_id)))

    data = [{'id': property_id, 'name': landlord__first_name} for property_id, landlord__first_name in sample]
    return Response(data)



