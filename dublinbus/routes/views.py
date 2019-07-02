from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
from datetime import datetime

# Create your views here.

import json
def routes(request):
    # return HttpResponse(render({}, request))
    return render(request, "routes.html", {})

