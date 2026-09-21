from django.shortcuts import render
from .serializers import PaymentSerializer
from .models import Payment
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q, Sum, F
import django_filters
from datetime import date
from django.db.models.functions import Coalesce
from decimal import Decimal

# Create your views here.
class PaymentFilter(django_filters.FilterSet):
    month = django_filters.NumberFilter(field_name='date', lookup_expr='month')
    year = django_filters.NumberFilter(field_name='date', lookup_expr='year')

    class Meta:
        model = Payment
        fields = ['id', 'property_obj', 'tenant', 'rent_status', 'completion', 'date', 'month', 'year']

class PaymentListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()

    search_fields = [
        'property_obj__landlord__first_name',
        'property_obj__landlord__last_name',
        'tenant__first_name',
        'tenant__last_name',
        'unit__unit_number'
    ]
    ordering_fields = ['property_obj', 'unit', 'date', 'tenant', 'rent_payable', 'rent', 'completion_progress']
    filterset_class = PaymentFilter


class PaymentDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()

@api_view(['GET'])
@permission_classes([AllowAny])
def property_detail(request, pk):
    today = date.today()
    month = request.query_params.get('month', today.month)
    year = request.query_params.get('year', today.year)

    ordering = request.query_params.get('ordering', 'unit__unit_number')

    ordering_map = {
        'unit_number': 'unit__unit_number',
        '-unit_number': '-unit__unit_number',
        'tenant': 'tenant__first_name',
        '-tenant': '-tenant__first_name',
        'rent_payable': 'rent_payable',
        '-rent_payable': '-rent_payable'
    }

    db_ordering = ordering_map.get(ordering, 'unit__unit_number')

    qs = Payment.objects.filter(
        property_obj_id=pk,
        date__month=month,
        date__year=year
    ).select_related('tenant', 'unit', 'property_obj__landlord').order_by(db_ordering)

    serializer = PaymentSerializer(qs, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([AllowAny])
def payment_suggestions(request):
    query = request.GET.get('q', '')

    if len(query) < 2:
        return Response([])

    query_parts = query.split()
    combined = Q()

    for x in query_parts:
        combined &= (
            Q(property_obj__landlord__first_name__icontains = x) |
            Q(property_obj__landlord__last_name__icontains = x) |
            Q(tenant__first_name__icontains = x) |
            Q(tenant__last_name__icontains = x) |
            Q(unit__unit_number__icontains = x) 
        )

    matches = Payment.objects.prefetch_related('property_obj', 'tenant', 'unit').filter(combined).distinct()[:30]
    serializer = PaymentSerializer(matches, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def payment_reports(request):
    today = date.today()
    month = today.month
    year = today.year

    if month == 1:
        previous_month = 12
        previous_year = year - 1
    else: 
        previous_month = month - 1
        previous_year = year

    total_payments = Payment.objects.count()
    total_rent_payable = Payment.objects.filter(date__month=month, date__year=year).aggregate(
        sum=Coalesce(Sum('rent_payable'), Decimal('0'))
    )['sum']

    last_month_rent_payable = Payment.objects.filter(date__month=previous_month, date__year=previous_year).aggregate(
        sum=Sum('rent_payable')
    )['sum'] or 0
    payable_difference = total_rent_payable - last_month_rent_payable
    rent_payable_percentage = ((payable_difference / last_month_rent_payable) * 100) if total_rent_payable and last_month_rent_payable else 0


    total_rent = Payment.objects.filter(date__month=month, date__year=year).aggregate(
       sum=Coalesce(Sum('rent'), Decimal('0'))
    )['sum']
    last_month_rent = Payment.objects.filter(date__month=previous_month, date__year=previous_year).aggregate(
        sum=Sum('rent')
    )['sum'] or 0
    rent_difference = total_rent - last_month_rent
    rent_percentage = ((rent_difference / last_month_rent) * 100) if last_month_rent and total_rent else 0

    total_overdue = Payment.objects.filter(rent_status='overdue', date__month=month, date__year=year).aggregate(
        sum=Coalesce(Sum('rent_payable'), Decimal('0'))
    )['sum'] or 0
    last_month_overdue = Payment.objects.filter(rent_status='overdue', date__month=previous_month, date__year=previous_year).aggregate(
        sum=Sum('rent_payable')
    )['sum'] or 0
    overdue_difference = total_overdue - last_month_overdue
    overdue_percentage = ((overdue_difference / last_month_overdue) * 100) if total_overdue and last_month_overdue else 0

    return Response({
        'total_payments': f'{total_payments:,}',
        'total_rent_payable': f'{total_rent_payable:,}',
        'rent_payable_percentage' : f"{rent_payable_percentage:,.2f}",
        'total_rent' : f'{total_rent:,}',
        'rent_percentage' : f'{rent_percentage:,.2f}',
        'total_overdue': f"{total_overdue:,}",
        'overdue_percentage': f"{overdue_percentage:,.2f}",
    })



