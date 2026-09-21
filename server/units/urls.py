from django.urls import path
from . import views

urlpatterns = [
    path('', views.UnitListView.as_view()),
    path('<int:pk>/', views.UnitDetailView.as_view()),
    path('suggestions/', views.unit_suggestions),
    path('reports/', views.unit_reports)
]