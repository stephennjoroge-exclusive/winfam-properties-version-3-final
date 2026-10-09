from django.shortcuts import render
from .serializers import UtilitySerializer
from .models import Utility
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q

# Create your views here.
class UtilityListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UtilitySerializer
    queryset = Utility.objects.all()

    search_fields = ['previous_reading', 'current_reading', 'item']
    ordering_fields = ['property_obj', 'item', 'unit__unit_number', 'previous_reading', 'current_reading']
    filterset_fields = ['item', 'property_obj']

class UtilityDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    serializer_class = UtilitySerializer
    queryset = Utility.objects.all()

@api_view(['GET'])
@permission_classes([AllowAny])
def utility_suggestions(request):
    query = request.GET.get('q', '')

    if len(query) < 2:
        return Response([])

    query_split = query.split()
    combined = Q()

    for x in query_split:
        combined &= (
            Q(property_obj__landlord__first_name__icontains = x) |
            Q(property_obj__landlord__last_name__icontains = x) |
            Q(unit__unit_number__icontains = x) |
            Q(item__icontains = x) |
            Q(previous_reading__icontains = x) |
            Q(current_reading__icontains = x) 
            
        )

    matches = Utility.objects.select_related('property_obj', 'property_obj__landlord', 'unit').filter(combined)
    data = UtilitySerializer(matches, many=True)
    return Response(data.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def utilities_report(request):
    utility = Utility.objects.all()
    utility_count = Utility.objects.count()
    total_unit_cost = sum(item.unit_cost for item in utility)


    return Response({
        'utility_count': utility_count,
        'total_unit_cost': f'{total_unit_cost:,.2f}'
    })



