from django.urls import path 
from . import views

urlpatterns = [
    path('', views.PaymentCreateListView.as_view()),
    path('<int:pk>/', views.PaymentDetailView.as_view()),
    path('suggestions/', views.payment_suggestions),
    path('reports/', views.payment_reports),
    path('property-detail/<int:pk>/', views.property_detail)
]