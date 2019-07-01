from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .models import *

from django.views.generic import TemplateView
from map.forms import MapForm
import json

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



