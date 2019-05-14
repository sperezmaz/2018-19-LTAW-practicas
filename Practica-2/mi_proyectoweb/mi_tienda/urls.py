from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.home_view),
    url(r'^index/', views.home_view),
    url(r'^busqueda/$', views.busqueda, name='busqueda'),
    url(r'^datos/', views.base_datos),
    url(r'^formulario/', views.formulario_compra),
    url(r'^(?P<producto_x>[\w ]+)/$', views.productos),
    url(r'^form.html/', views.formulario_compra),
]
