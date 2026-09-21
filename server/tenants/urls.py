from django.urls import path
from . import views

urlpatterns = [
    path('', views.TenantListView.as_view()),
    path('<int:pk>/', views.TenantDetailView.as_view()),
    path('suggestions/', views.tenant_suggestions),
    path('reports/', views.tenant_reports)
]