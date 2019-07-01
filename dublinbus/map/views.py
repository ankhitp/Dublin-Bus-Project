from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
from dublinbus.settings import TEMPLATES
from django.views.generic import TemplateView
from map.forms import MapForm
from map.middleware import MobileTemplatesMiddleware
import json




# CHEATING DJANGO MOBILE

# Some standard Django stuff
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.template import Context, loader
 
# list of mobile User Agents
mobile_uas = [
	'w3c ','acs-','alav','alca','amoi','audi','avan','benq','bird','blac',
	'blaz','brew','cell','cldc','cmd-','dang','doco','eric','hipt','inno',
	'ipaq','java','jigs','kddi','keji','leno','lg-c','lg-d','lg-g','lge-',
	'maui','maxo','midp','mits','mmef','mobi','mot-','moto','mwbp','nec-',
	'newt','noki','oper','palm','pana','pant','phil','play','port','prox',
	'qwap','sage','sams','sany','sch-','sec-','send','seri','sgh-','shar',
	'sie-','siem','smal','smar','sony','sph-','symb','t-mo','teli','tim-',
	'tosh','tsm-','upg1','upsi','vk-v','voda','wap-','wapa','wapi','wapp',
	'wapr','webc','winw','winw','xda','xda-'
	]
 
mobile_ua_hints = [ 'SymbianOS', 'Opera Mini', 'iPhone' ]

# def mobileBrowser(request):
#     ''' Super simple device detection, returns True for mobile devices '''
 
#     mobile_browser = False
#     ua = request.META['HTTP_USER_AGENT'].lower()[0:4]
#     print("ua is", ua)
#     if (ua in mobile_uas):
#         mobile_browser = True
#     else:
#         for hint in mobile_ua_hints:
#             if request.META['HTTP_USER_AGENT'].find(hint) > 0:
#                 mobile_browser = True
 
#     return mobile_browser


# def index(request):
#     '''Render the index page'''
 
#     if mobileBrowser(request):
#         t = loader.get_template('m_index.html')
#     else:
#         t = loader.get_template('index.html')
 
#     c = Context( { }) 
 
#     return HttpResponse(t.render(c))


# END OF CHEAT




class map_view(TemplateView):
    template_name = 'map.html'
    
    # get method
    def get(self, request):
        print("star")
        a = MobileTemplatesMiddleware
        # print(mobileBrowser(request))
        a.process_request(self, request)
        print("i am here")
        # request.GET = {}
        # middleware = SetFlavourMiddleware()
        # middleware.process_request(request)
        form = MapForm()
        # if mobileBrowser(request):
        #     template_name = 'm_map.html'
        # else:
        #     template_name = 'map.html'
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



from datetime import datetime
import os
import requests
from django.views.decorators.csrf import csrf_exempt
dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, "../static/files/stops_info.json")


# Create your views here.

def index(request):
    file = open(filename,"r")
    # return HttpResponse(render({}, request))
    loadjson = json.load(file)
    file.close()



    # myfile = "static/files/stops_info.json"
    # file = open(myfile,"r")
    # return HttpResponse(render({}, request))
    # loadjson = json.load(file)
    # file.close()
    # print(data1)
    # print("data 2", data2)
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

