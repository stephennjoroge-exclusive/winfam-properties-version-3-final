from django.shortcuts import render
from .serializers import PropertySerializer
from .models import Property
from financials.models import Payment
from units.models import Unit
from tenants.models import Tenant
from django.db.models import Subquery, OuterRef, Count, Value, IntegerField, Sum, DecimalField
from django.db.models.functions import Coalesce, Concat
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from datetime import datetime

# Create your views here.
class PropertyListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropertySerializer
    queryset = Property.objects.all()

    search_fields = ['landlord__first_name']
    ordering_fields = ['landlord', 'location', 'total_units']
    filterset_fields = ['landlord__first_name']

    def get_queryset(self):
        units = Unit.objects.filter(property_obj=OuterRef('pk')).values('property_obj').annotate(count=Count('id')).values('count')
        units_per_property = Property.objects.annotate(computed_total_units=Subquery(units))

        return units_per_property

class PropertyDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropertySerializer
    queryset = Property.objects.all()

class PropertyFilterView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropertySerializer
    queryset = Property.objects.all()

    pagination_class = None

@api_view(['GET'])
@permission_classes([AllowAny])
def property_suggestions(request):
    query = request.GET.get('q', '')

    if len(query) < 2:
        return Response([])

    query_split = query.split()
    combined = Q()

    for x in query_split:
        combined &= (
            Q(landlord__first_name__icontains=x) |
            Q(managers__icontains=x) |
            Q(location__icontains=x) 
        )

    matches = Property.objects.select_related('landlord').filter(combined).distinct()[:50]
    data = PropertySerializer(matches, many=True)
    return Response(data.data, status=status.HTTP_200_OK) 

@api_view(['GET'])
@permission_classes([AllowAny])
def property_reports(request):
    total_properties = Property.objects.count()
    total_caretakers = Payment.objects.filter(rent_status = 'caretaker').distinct()

    return Response({
        'total_properties': total_properties,
        'total_caretaker': total_caretakers.count()
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def property_info(request, pk):

    today = datetime.now()
    month = today.month
    year = today.year
    
    units_per_property = Unit.objects.filter(
        property_obj=OuterRef('pk')
    ).values('property_obj').annotate(
        count=Count('id')
    ).values('count')

    tenants_per_property = Tenant.objects.filter(
        property_obj=OuterRef('pk')
    ).values('property_obj').annotate(
        count=Count('id')
    ).values('count')

    total_rent_per_property = Payment.objects.filter(
        property_obj=OuterRef('pk'), date__month=month, date__year=year
    ).values('property_obj').annotate(
        sum=Sum('rent')
    ).values('sum')

    total_rent_payable_per_property = Payment.objects.filter(
        property_obj=OuterRef('pk'), date__month=month, date__year=year
    ).values('property_obj').annotate(
        sum=Sum('rent_payable')
    ).values('sum')

    total_vacant_per_property = Payment.objects.filter(
        property_obj=OuterRef('pk'), date__month=month, date__year=year, rent_status='vacant'
    ).values('property_obj').annotate(count=Count('id')).values('count')

    total_overdue_per_property = Payment.objects.filter(
        property_obj=OuterRef('pk'), rent_status = 'overdue', date__month=month, date__year=year
    ).values('property_obj').annotate(count=Count('id')).values('count')

    total_water_bill = Payment.objects.filter(
        property_obj=OuterRef('pk'), date__month=month, date__year=year
    ).values('property_obj').annotate(sum=Sum('water')).values('sum')

    property_metric = Property.objects.filter(pk=pk).annotate(
        full_name = Concat('landlord__first_name', Value(' '), 'landlord__last_name'),
        computed_units_per_property = Coalesce(Subquery(units_per_property), Value(0, output_field=IntegerField())),
        computed_tenants_per_property = Coalesce(Subquery(tenants_per_property), Value(0, output_field=IntegerField())),
        computed_total_rent_per_property = Coalesce(Subquery(total_rent_per_property), Value(0, output_field=DecimalField())),
        computed_total_rent_payable_per_property = Coalesce(Subquery(total_rent_payable_per_property), Value(0, output_field=DecimalField())),
        total_vacant_per_property = Coalesce(Subquery(total_vacant_per_property), Value(0, output_field=IntegerField())),
        total_overdue_per_property = Coalesce(Subquery(total_overdue_per_property), Value(0, output_field=IntegerField())),
        total_water_bill = Coalesce(Subquery(total_water_bill), Value(0, output_field=DecimalField()))
    ).values(
        'id',
        'full_name',
        'computed_units_per_property',
        'computed_tenants_per_property',
        'computed_total_rent_per_property',
        'computed_total_rent_payable_per_property',
        'total_vacant_per_property',
        'total_overdue_per_property',
        'total_water_bill'
    ).first()

    if not property_metric:
        return Response({'Error:': 'property not found'}, status=status.HTTP_400_BAD_REQUEST)

    property_metric['computed_total_rent_per_property'] = f"{property_metric['computed_total_rent_per_property']:,}"
    property_metric['computed_total_rent_payable_per_property'] = f"{property_metric['computed_total_rent_payable_per_property']:,}"
    property_metric['total_water_bill'] = f"{property_metric['total_water_bill']:,}"

    return Response(property_metric, status=status.HTTP_200_OK)




