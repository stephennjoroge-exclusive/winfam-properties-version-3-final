from django.urls import path
from . import views

urlpatterns = [
    path('', views.LandlordListAPIView.as_view()),
    path('<int:pk>/', views.LandlordDetailAPIView.as_view())
]