from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import json
from django.urls import path
from django.views.generic import TemplateView
from django_user_agents.utils import get_user_agent
# from forms.py import favouritesForm

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

    
class favourites_view(TemplateView):
    template_name = 'favourites.html'
    
    # get method
    def get(self, request):
        # initialise a form
        form = favouritesForm()
        json_data = open('static/files/stops_info.json')
        stops_data = json.load(json_data)
        user_agent = get_user_agent(request)
        if user_agent.is_mobile:
            return render(request, 'mobile/m_favourites.html', {'load': stops_data})
        elif user_agent.is_tablet:
            return render(request, 'mobile/m_favourites.html', {'load': stops_data})
        else:
            return render(request, 'favourites.html', {'load': stops_data})
            
    # post method, which saves to the model
    def post(self, request):
        form = favouritesForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            text = form.cleaned_data['post']
            post.save()
            # initialise another blank form
        form = favouritesForm(request.POST)
            # return redirect('/home/')
        # render the form and the text
        args = {'form': form, 'text':text}
        return render(request, self.template_name, args)