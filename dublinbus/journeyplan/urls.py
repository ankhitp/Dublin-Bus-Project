from django.urls import path

from . import views
# from views import journeyplan

urlpatterns = [
    path('', views.bus_prediction, name='bus_prediction'),

    path('', views.journeyplan, name='journeyplan'),

]