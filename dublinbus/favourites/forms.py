from django import forms
from favourites.models import Post

# class to create a form
class favouritesForm(forms.ModelForm):
    origin = forms.CharField()
    destination = forms.CharField()


    # class to describe the model
    class Meta:
        model = Post
        fields = ('origin','destination',)


class ContactForm(forms.ModelForm):
    origin = forms.CharField()
    destination = forms.CharField()
