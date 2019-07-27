from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
from datetime import datetime
import os
import requests
from django.views.decorators.csrf import csrf_exempt
import json
from django_user_agents.utils import get_user_agent


def routes(request):
    json_data = open('static/files/routeList.json')
    routeData = json.load(json_data)
    return render(request, 'routes.html', {'load': routeData})




