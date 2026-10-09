from django.urls import path
from . import views

urlpatterns = [
    path('', views.PropertyCreateListView.as_view()),
    path('<int:pk>/', views.PropertyDetailView.as_view()),
    path('filters/', views.PropertyFilterView.as_view()),
    path('suggestions/', views.property_suggestions),
    path('reports/', views.property_reports),
    path('info/<int:pk>/', views.property_info)
]