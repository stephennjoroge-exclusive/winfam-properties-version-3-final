from django.shortcuts import render
from .serializers import TenantSerializer
from .models import Tenant
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q, Sum, F
import django_filters
from django.db.models import OuterRef, Subquery
from financials.models import Payment

# Create your views here.
class TenantFilter(django_filters.FilterSet):
    payments__rent_status = django_filters.CharFilter(method='filter_latest_rent_status')

    class Meta:
        model = Tenant
        fields = ['id', 'property_obj', 'first_name', 'last_name', 'payments__rent_status']

    def filter_latest_rent_status(self, queryset, name, value):
        latest_payment = Payment.objects.filter(
            tenant=OuterRef('pk')
        ).order_by('-date')  

        return queryset.annotate(
            latest_rent_status=Subquery(latest_payment.values('rent_status')[:1])
        ).filter(latest_rent_status=value)
    
class TenantListView(ListCreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = TenantSerializer
    queryset = Tenant.objects.all()

    search_fields = ['property_obj__landlord__first_name', 'property_obj__landlord__last_name', 'first_name', 'last_name']
    ordering_fields = ['unit__unit_number', 'property_obj__landlord__first_name', 'first_name', 'payments__rent']
    filterset_class = TenantFilter

    def post(self, request, *args, **kwargs):
        serializer = TenantSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TenantDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    serializer_class = TenantSerializer
    queryset = Tenant.objects.all()

@api_view(['GET'])
@permission_classes([AllowAny])
def tenant_suggestions(request):
    query = request.GET.get('q', '')

    if len(query) < 2:
        return Response([])

    query_split = query.split()
    combined = Q()

    for x in query_split:
        combined &= (
            Q(property_obj__landlord__first_name__icontains=x) |
            Q(property_obj__landlord__last_name__icontains=x) |
            Q(unit__unit_number__icontains=x) |
            Q(first_name__icontains=x) |
            Q(last_name__icontains=x) 
        )

    matches = Tenant.objects.select_related('property_obj', 'property_obj__landlord', 'unit').filter(combined).distinct()[:20]
    data = TenantSerializer(matches, many=True)
    return Response(data.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def tenant_reports(request):
    total_tenants = Tenant.objects.count()

    latest_payment = Payment.objects.filter(tenant=OuterRef('pk')).order_by('-date')
    total_balance = Tenant.objects.annotate(
        total_rent_payable = Subquery(latest_payment.values('rent_payable')[:1]),
        total_rent = Subquery(latest_payment.values('rent')[:1])
    ).annotate(
        balance = F('total_rent_payable') - F('total_rent')
    )
    total_outstanding_balance = total_balance.aggregate(
        total=Sum('balance')
    )['total'] or 0

    tenant_balance = Tenant.objects.annotate(
        total_rent_payable = Subquery(latest_payment.values('rent_payable')[:1]),
        total_rent = Subquery(latest_payment.values('rent')[:1])
    ).annotate(
        balance = F('total_rent_payable') - F('total_rent')
    ).filter(
        balance__gt=0
    )
    total_balance_count = tenant_balance.count()

    total_occupied = Tenant.objects.filter(unit__unit_status='occupied').count() or 0

    occupied_percentage =  round((total_occupied / total_tenants) * 100) if total_tenants else 0
   
    return Response({
        'total_tenants': f'{total_tenants:,}',
        'total_outstanding_balance': f"{total_outstanding_balance:,}",
        'tenant_balance' : f"{total_balance_count:,}",
        'total_occupied' : f"{total_occupied:,}",
        'occupied_percentage': occupied_percentage
    })

