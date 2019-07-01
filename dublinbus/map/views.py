from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views.generic import TemplateView
from map.forms import MapForm
import json

class map_view(TemplateView):
    template_name = 'map.html'
    
    # get method
    def get(self, request):
        # initialise a form
        form = MapForm()
        return render(request, self.template_name, {'form':form})

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





# Create your views here.

def index(request):
    json_data = open('static/files/stops_info.json')   
    data1 = json.load(json_data) # deserialises it
    data2 = json.dumps(data1) # json formatted string
    json_data.close()



    # myfile = "static/files/stops_info.json"
    # file = open(myfile,"r")
    # return HttpResponse(render({}, request))
    # loadjson = json.load(file)
    # file.close()
    # print(data1)
    # print("data 2", data2)
    return render(request, "index.html", {
        'load': data1
    })