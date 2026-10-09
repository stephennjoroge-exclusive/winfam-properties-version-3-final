from django.shortcuts import render
from .models import Unit
from financials.models import Payment
from .serializers import UnitSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveDestroyAPIView
from django.db.models import OuterRef, Subquery
from rest_framework.decorators import api_view, permission_classes
import django_filters
from django.db.models import Q
from django.db.models import IntegerField
from django.db.models.functions import Cast

# Create your views here.
class UnitFilter(django_filters.FilterSet):
    payments__rent_status = django_filters.CharFilter(method='filter_latest_rent_status')

    class Meta:
        model = Unit
        fields = ['id', 'property_obj', 'unit_number', 'unit_status']

    def filter_latest_rent_status(self, queryset, name, value):
        latest_payment = Payment.objects.filter(
            unit=OuterRef('pk')
        ).order_by('-date')

        return queryset.annotate(
            latest_rent_status = Subquery(latest_payment.values('rent_status')[:1])
        ).filter(latest_rent_status=value)

    
class UnitListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UnitSerializer
    queryset = Unit.objects.prefetch_related('property_obj').all()

    search_fields = ['id', 'unit_number', 'property_obj__landlord__first_name', 'property_obj__landlord__last_name']
    ordering_fields = [ ('unit_number_int', 'unit_number'), ('property_obj__landlord__first_name')]
    filterset_class = UnitFilter

    def get_queryset(self):
        return Unit.objects.prefetch_related('property_obj').annotate(
            unit_number_int=Cast('unit_number', IntegerField())
        )

class UnitDetailView(RetrieveDestroyAPIView):
    permission_classes = [AllowAny]
    serializer_class = UnitSerializer
    queryset = Unit.objects.all()

@api_view(['GET'])
@permission_classes([AllowAny])
def unit_suggestions(request):
    query = request.GET.get('q', '')

    if len(query) < 2:
        return Response([])

    query_split = query.split()
    combined = Q()

    for x in query_split:
        combined &= (
            Q(unit_number__icontains = x) |
            Q(property_obj__landlord__first_name__icontains=x) |
            Q(property_obj__landlord__last_name__icontains=x) 
        )

    matches = Unit.objects.filter(combined).prefetch_related('property_obj')
    serializer = UnitSerializer(matches, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def unit_reports(request):
    total_units = Unit.objects.count()
    total_occupied = Unit.objects.filter(unit_status='occupied').count()

    return Response({
        'total_units': f'{total_units:,}',
        'total_occupied': f'{total_occupied:,}'
    })

