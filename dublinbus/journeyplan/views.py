from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.template import loader
import json
from django_user_agents.utils import get_user_agent
from django.contrib.auth import get_user_model
User = get_user_model()

import json
import pickle
import requests
import sqlalchemy
import requests
import time
import numpy


def journeyplan(request):
    # return HttpResponse(render({}, request))
    json_data = open('static/files/stops_info.json')
    stops_data = json.load(json_data)
    user_agent = get_user_agent(request)
    if user_agent.is_mobile:
        return render(request, 'mobile/m1_journeyplan.html', {'load': stops_data})
    elif user_agent.is_tablet:
        return render(request, 'mobile/m1_journeyplan.html', {'load': stops_data})
    else:
        return render(request, 'journeyplan.html', {'load': stops_data})


def bus_prediction(request):
    direction = request.POST.get("direction")
    dayOfWeek = request.POST.get("dayOfWeek")
    rushHour = request.POST.get("rushHour")
    monToThurRushHour = request.POST.get("direction")
    friday = request.POST.get("direction")
    windSpeed = request.POST.get("windSpeed")
    temp = request.POST.get("temp")
    randomForest_Results = {}

    with open("static/pickle/15A_1_pickle", "rb") as handle:
        model = pickle.load(handle)
        totaljourney = 0
        for key, value in model.items():
            thismodel = model[key]
            thisprediction = thismodel.predict(numpy.array([[direction, dayOfWeek, rushHour, monToThurRushHour, friday, windSpeed, temp]]))
            randomForest_Results[key] = thisprediction
            totaljourney += thisprediction
    print("total journey time: ", totaljourney / 60, "minutes")
    print(randomForest_Results)
    return JsonResponse(randomForest_Results)
