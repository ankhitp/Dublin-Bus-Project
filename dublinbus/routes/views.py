from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
from datetime import datetime
import os
import requests
from django.views.decorators.csrf import csrf_exempt
dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, "../static/files/stops_info.json")

# Create your views here.

import json
def routes(request):
    # return HttpResponse(render({}, request))
    return render(request, "routes.html", {})

@csrf_exempt
def getRoutes(request):
    if 'startLat' in request.POST:
        startLat = request.POST['startLat']
    if 'startLong' in request.POST:
        startLong = request.POST['startLong']
    if 'destLat' in request.POST:
        destLat = request.POST['destLat']
    if 'destLong' in request.POST:
        destLong = request.POST['destLong']
    myTime = datetime.now().isoformat()
    url = "https://transit.api.here.com/v3/route.json?app_id=tL7r9QKJ3KlE5Kc9LGYo&app_code=1arMcSHt_o31xFSeBRswsA&modes=bus&routing=all&dep="+startLat+","+startLong+"&arr="+destLat+","+destLong+"&time="+str(myTime)
    print(url)
    response = requests.get(url)
    response = response.json()
    return JsonResponse(response,safe=False)

