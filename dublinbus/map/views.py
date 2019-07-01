from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .models import *

# Create your views here.

import json
# Create your views here.

def index(request):
    file = open("/Users/judy/Desktop/dublinbus/dublinbus/static/files/stops_info.json","r")
    # return HttpResponse(render({}, request))
    loadjson = json.load(file)
    file.close()

    return render(request, "index.html", {
        'load': loadjson,
    })