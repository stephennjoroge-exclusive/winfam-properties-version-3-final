from django.urls import path
from . import views

urlpatterns = [
    path('', views.UtilityListView.as_view()),
    path("<int:pk>/", views.UtilityDetailView.as_view()),
    path('suggestions/', views.utility_suggestions),
    path('reports/', views.utilities_report)
]