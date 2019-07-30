from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from django.views.decorators.csrf import csrf_exempt
from .forms import CustomUserCreationForm
from users.models import CustomUser

class SignUp(CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'signup.html'

@csrf_exempt
def addFav(request):
    start = request.POST.get('start', '')
    end = request.POST.get('end', '')
    myUser = request.POST.get('user', '')
    t = CustomUser.objects.get(username=myUser)
    if len(t.favourites) == 0:
        t.favourites = start + ":" + end
    else:
        t.favourites = t.favourites + "*" + start + ":" + end
    try:
        t.save()
        return HttpResponse(status=200)
    except Exception:
        return HttpResponse(status=400)
