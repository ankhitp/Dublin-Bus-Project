from django import forms
from favourites.models import Post

# class to create a form
class favouritesForm(forms.ModelForm):
    field1 = forms.CharField()
    field2 = forms.CharField()


    # class to describe the model
    class Meta:
        model = Post
        fields = ('field1','field2',)