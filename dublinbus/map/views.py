from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
from django_user_agents.utils import get_user_agent
from django.contrib.auth import get_user_model
User = get_user_model()

from dublinbus.settings import TEMPLATES
from django.views.generic import TemplateView

from map.forms import MapForm
import json


class map_view(TemplateView):
    template_name = 'map.html'
    
    # get method
    def get(self, request):
        form = MapForm()
        json_data = open('static/files/stops_info.json')
        stops_data = json.load(json_data)
        user_agent = get_user_agent(request)
        json_routedata = open('static/files/serving_route.json')
        route_data = json.load(json_routedata)
        if user_agent.is_mobile:
            return render(request, 'mobile/m_map.html', {'form':form, 'load': stops_data, 'routedata': route_data})
        elif user_agent.is_tablet:
            return render(request, 'mobile/m_map.html', {'form':form, 'load': stops_data, 'routedata': route_data})
        else:
            return render(request, 'map.html', {'form':form, 'load': stops_data, 'routedata': route_data})


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



from datetime import datetime
import os
import requests
from django.views.decorators.csrf import csrf_exempt
dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, "../static/files/stops_info.json")
# routefile = os.path.join(dirname, "../static/files/serving_route.json")


# Create your views here.

# def index(request):
#     file = open(filename,"r")
#     # return HttpResponse(render({}, request))
#     loadjson = json.load(file)
#     file.close()

#     return render(request, "index.html", {
#         'load': loadjson,
#     })

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

