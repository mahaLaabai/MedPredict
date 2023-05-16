from django.conf.urls import url
from api import views

urlpatterns = [
    url(r'^api/v1/register$', views.register),
    url(r'^api/v1/login$', views.login),
    url(r'^api/v1/users$', views.handle_users),
    url(r'^api/v1/medicalfolders$', views.handle_medicalfolders),
    url(r'^api/v1/scans$', views.handle_scans)
]
