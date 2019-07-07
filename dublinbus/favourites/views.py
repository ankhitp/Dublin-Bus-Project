from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import json
from django_user_agents.utils import get_user_agent

import json

# Create your views here.

def favourites(request):
    # return HttpResponse(render({}, request))
    json_data = open('static/files/stops_info.json')
    stops_data = json.load(json_data)
    user_agent = get_user_agent(request)
    if user_agent.is_mobile:
        return render(request, 'mobile/m_favourites.html', {'load': stops_data})
    elif user_agent.is_tablet:
        return render(request, 'mobile/m_favourites.html', {'load': stops_data})
    else:
        return render(request, 'favourites.html', {'load': stops_data})