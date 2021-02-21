## How to start working on this project
* First consult the links from the readme.md to understand how django and angular work
* The steps bellow describe how to work with django-rest-framework with a **sample** model
* Most of the steps bellow are for a reintepreted tutorial from here : https://learndjango.com/tutorials/official-django-rest-framework-tutorial-beginners

#### 01. Create the model
:information_source: Our **example** model will be **Snippet**
```
from django.db import models

LANGUAGE_CHOICES = (
    ('python', 'Python'),
    ('java', 'Java'),
    ('csharp', 'C#'),
    ('php', 'PHP'),
)

STYLE_CHOICES = (
    ('friendly', 'friendly'),
    ('unfriendly', 'unfriendly'),
)

# Create your models here.
class Snippet(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100, blank=True, default='')
    code = models.TextField()
    linenos = models.BooleanField(default=False)
    language = models.CharField(choices=LANGUAGE_CHOICES, default='python', max_length=100)
    style = models.CharField(choices=STYLE_CHOICES, default='friendly', max_length=100)

    class Meta:
        ordering = ['created']
```

#### 02. Restart the docker container to apply the new model
### TODO : CONFIRMER UTILITÉ
Quit the container if already started `CTRL + C`
Start or restart the container with : `docker-compose run --build`

#### 03. Make migration inside webapp container
1. Execute the following migrations **INSIDE** the webapp container, see: [How to execute commands inside container?](#inside_container)
3. From container bash terminal, execute `python manage.py makemigrations snippets`
4. Then execute `python manage.py migrate`

Result should be this :
![migration result](https://puu.sh/Hgktz/a42be7f971.png)

### Next part is about populating the database with test data
For production (scripted build) the best approach would be through python shell with pre written script, as show here : https://www.django-rest-framework.org/tutorial/1-serialization/#working-with-serializers

---
For development (and without pre written script) this approach is faster and easier : https://learndjango.com/tutorials/official-django-rest-framework-tutorial-beginners

Instead of using script, we will use our app frontend !

#### 04. Complete `snippets/admin.py` as follow
```
from django.contrib import admin
from .models import Snippet

# Register your models here.
admin.site.register(Snippet)
```

#### 05. Create superuser login
Must be executed **INSIDE** container
1. Be sur you are in container bash
2. Then `python manage.py createsuperuser`
   1. username : `admin`
   2. password : `admin`
4. Go to http://localhost:8000/admin and login

#### 06. Click on `+Add` on the `Snippets` line

#### 07. Add the following 2 snippets
Title : `Hello World`
Code : 
```
print("Hello World!")
```
Linenos : `unchecked`
language : `Python`
Style : `friendly`

Title : `Say Hi function`
Code : 
```
def say_hi(name):
    print(name)
```
Linenos : `unchecked`
language : `Python`
Style : `friendly`


### Serialization
#### 08. Create serializer file with : `touch snippets/serializers.py`

#### 9. Update it as follow
```
# snippets/serializers
from rest_framework import serializers
from .models import Snippet, LANGUAGE_CHOICES, STYLE_CHOICES


class SnippetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Snippet
        fields = ('id', 'title', 'code', 'linenos',
                  'language', 'style', )
```

#### 10. Create the view (which acts like a controller !)
Edit snippets/view.py as follow
```
from django.shortcuts import render
from rest_framework import generics
from .models import Snippet
from .serializers import SnippetSerializer

# Create your views here.
class SnippetList(generics.ListCreateAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer


class SnippetDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
```

#### 11. Configure the URLs
Edit config/urls.py as follow
```
# tutorial/urls.py
from django.contrib import admin
from django.urls import include, path # new

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('snippets.urls')), # new
]
```

#### 12. create a urls.py file inside snippets folder
`touch snippets/urls.py`

And add the following code
```
# snippets/urls.py
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from snippets import views

urlpatterns = [
    path('snippets/', views.SnippetList.as_view()),
    path('snippets/<int:pk>/', views.SnippetDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
```

### IHM API
django-rest-framework embarks a browsable API

#### 13. Go to http://localhost:8000/snippets/ to list our snippets
Or to show one specific snippet : http://localhost:8000/snippets/1

### API access and roles rules
See : https://learndjango.com/tutorials/official-django-rest-framework-tutorial-beginners
**Request & Response** chapter

=> To drop the database, simply close the container and delete it. 
___
<a id="inside_container"></a>
### How to execute commands inside container ?
1. **DO NOT** use GitBash CLI as it won't be able to process the next commands
2. Get ID of current `web` container with command line : `docker ps`
3. Then execute `docker exec -it my_ID bash` (not allowed from GitBash CLI)

<a id="drop_db"></a>
### How to drop the containerized postgres db ?
`docker exec -t -i c4d197487ad3 psql -U postgres -d postgres -c "DROP DATABASE postgres;"`
`docker exec -t -i c4d197487ad3 psql -U postgres -d postgres -c "CREATE DATABASE postgres;"`

___
### Sources : 
* ~~https://www.django-rest-framework.org/tutorial/quickstart/~~ next one is more complete
* https://www.django-rest-framework.org/tutorial/1-serialization/