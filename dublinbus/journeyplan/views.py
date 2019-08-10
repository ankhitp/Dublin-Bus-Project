from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.template import loader
import json
from django_user_agents.utils import get_user_agent
from django.contrib.auth import get_user_model
User = get_user_model()
from django.views.decorators.csrf import csrf_exempt
import pandas as pd

import json
import pickle
import requests
import sqlalchemy
import requests
import time
import numpy
import csv
from csv import DictReader

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

@csrf_exempt
def bus_prediction(request):
 
    url = 'http://api.openweathermap.org/data/2.5/weather?appid=a8e1877ec087d7a2904f50a41ed61bfa&q=Dublin&units=metric'
    weather_detalis = requests.get(url)
    weatherdata = json.loads(weather_detalis.text)
    print("request", request)
    
    endPoint = request.POST.get("endPoint")
    print("end point", endPoint)
    
    startingPoint = request.POST.get("startingPoint")
    print("starting point", startingPoint)
  
    getroute = request.POST.get("route")
    route = str(getroute)
    print("route is", getroute)
    
    dayOfWeek = request.POST.get("dayOfWeek")
    print("day of week is", dayOfWeek)

    rushHour = request.POST.get("rushHour")
    print("rushHour", rushHour)

    monThurRush = request.POST.get("monThurRush")
    print("monThurRush", monThurRush)

    friday = request.POST.get("friday")
    print("friday", friday)
    
    print(weatherdata)

    windSpeed =  weatherdata['wind']['speed']
    temp = weatherdata['main']['temp']
    print("windSpeed", windSpeed)
    print("temp", temp)


    randomForest_Results = {}

    routecsv1 = route+"_direction1route.csv"
    routecsv2 = route+"_direction2route.csv"


    # Get direction by checking routes in csvs
    with open("static/busroutes/"+routecsv1) as f:
        busroute1 = [row["actual_stop_id"] for row in DictReader(f)]
    with open("static/busroutes/"+routecsv2) as f:
        busroute2 = [row["actual_stop_id"] for row in DictReader(f)]

    if startingPoint in busroute1:
        direction = 1
        routeholder = busroute1
        print("it's 1")
    elif startingPoint in busroute2:
        direction = 2
        routeholder = busroute2
        print("it's 2")
    else:
        direction = 1
        startingPoint = busroute1[0]
        routeholder = busroute1
        endstop = busrouute1[len(busroute1)-1]
        print("not in the route")

   
    # make a list of only stops you want
    first = routeholder.index(startingPoint)
    second = routeholder.index(endPoint)
    sectionlist = [routeholder[x]+":"+ routeholder[x+1] for x in range(first, second)]

    # open model dictionary, filter to only stops that you want
    with open("static/pickle/"+route+"_"+str(direction)+"_pickle", "rb") as handle:
        full_modelreturn = pickle.load(handle)

    returndict={}
    for key in sectionlist:
        if key in full_modelreturn:
            returndict[key] = full_modelreturn[key]
        else:
            continue
    print("start here", returndict)

    # # put together input dictionary
    testinput = {'direction': direction, 'dayOfWeek': dayOfWeek, 'rushHour': rushHour, 'monToThurRushHour': 0, 'friday': friday, 'windSpeed': windSpeed, 'temp': temp}
    print("testinput", testinput)
    datainput = pd.DataFrame([testinput])

    returnvalue={}
    # to count total journey time
    totaljourney=0
    # get all predictions from dictionary of models
    for key,value in returndict.items():
        thismodel=returndict[key]
        thisprediction=thismodel.predict(datainput)
        returnvalue[key]= thisprediction
        print(thisprediction)
        totaljourney+=thisprediction
    print("total journey time: ",totaljourney/60, "minutes")
    print("returnvalue", returnvalue)
    
    return returnvalue
