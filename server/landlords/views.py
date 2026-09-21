from django.shortcuts import render
from .serializers import LandlordSerializer
from .models import Landlord
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView

# Create your views here.
class LandlordListAPIView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = LandlordSerializer
    queryset = Landlord.objects.all()

    search_fields = ['first_name', 'last_name']
    ordering_fields = ['first_name', 'last_name']
    filterset_fields = []

class LandlordDetailAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    serializer_class = LandlordSerializer
    queryset = Landlord.objects.all()
