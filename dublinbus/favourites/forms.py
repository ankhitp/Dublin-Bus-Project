from django import forms
from favourites.models import Post

# class to create a form
class favouritesForm(forms.ModelForm):
    post = forms.CharField()

    # class to describe the model
    class Meta:
        model = Post
        fields = ('post',)