from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.template import loader
import json
from django_user_agents.utils import get_user_agent
from django.contrib.auth import get_user_model
User = get_user_model()
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


def bus_prediction(request):

     # pull values from the httpresponse here
    # route=response.route+"_"
    # startstop = response.startingPoint
    
    startstop = '188'
    endstop = '3114'
    route="4_"

    routecsv1 = route+"direction1route.csv"
    routecsv2 = route+"direction2route.csv"

    # Get direction by checking routes in csvs
    with open("static/busroutes/"+routecsv1) as f:
        busroute1 = [row["actual_stop_id"] for row in DictReader(f)]
    # with open("static/busroutes/"+routecsv2) as f:
    #     busroute2 = [row["actual_stop_id"] for row in DictReader(f)]
    if startstop in busroute1:
        direction = 1
        print("it's 1")
    elif startstop in busroute2:
        direction = 2
        print("it's 2")
    else:
        direction = 1
        startstop = busroute1[0]
        # endstop = busrouute1[len(busroute1)-1]
        print("not in the route")
    # print("direction", direction)
   
    # make a list of only stops you want
    first = busroute1.index(startstop)
    second = busroute1.index(endstop)
    sectionlist = [busroute1[x]+":"+ busroute1[x+1] for x in range(first, second)]

    # open model dictionary, filter to only stops that you want
    with open("static/pickle/"+route+str(direction)+"_pickle", "rb") as handle:
        full_modelreturn = pickle.load(handle)

    returndict={}
    for key in sectionlist:
        if key in full_modelreturn:
            returndict[key] = full_modelreturn[key]
        else:
            continue
    print("start here", returndict)

    # put together input dictionary (this is a sample)
    testinput = {'direction': direction, 'dayOfWeek': 2, 'rushHour': 1, 'monToThurRushHour': 1, 'friday': 0, 'windSpeed': 3, 'temp': 5}
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

    return(returnvalue)
