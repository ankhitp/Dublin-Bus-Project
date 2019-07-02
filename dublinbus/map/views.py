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

from .models import *

from django.views.generic import TemplateView
from map.forms import MapForm
import json

<<<<<<< HEAD
def index(request):
    file = open(filename,"r")
    # return HttpResponse(render({}, request))
    loadjson = json.load(file)
    file.close()

    return render(request, "index.html", {
        'load': loadjson,
    })

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

=======
class map_view(TemplateView):
    template_name = 'map.html'
    
    # get method
    def get(self, request):
        # initialise a form
        form = MapForm()
        json_data = open('static/files/stops_info.json')
        stops_data = json.load(json_data)
        return render(request, self.template_name, {'form':form, 'load': stops_data})

    # post method, which saves to the model
    def post(self, request):
        form = MapForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            text = form.cleaned_data['post']
            post.save()
            # initialise another blank form
            form = MapForm()
            # return redirect('/home/')
        # render the form and the text
        args = {'form': form, 'text':text}
        return render(request, self.template_name, args)



>>>>>>> master
