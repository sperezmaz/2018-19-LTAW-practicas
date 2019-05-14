# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from mi_tienda.forms import CompraForm

from mi_tienda.models import Product
from mi_tienda.models import Compra
# Create your views here.
def home_view (request):
    objects = Product.objects.all()
    context = {'objects': objects}
    return render(request, "index.html", context)

def productos(request, producto_x):
    producto_concreto = {}
    titulos = Product.objects.order_by('name')
    for titulo in titulos:
        if (titulo.name == producto_x):
            producto_concreto = titulo
    context = {'producto_concreto':producto_concreto}
    return render(request, "producto.html", context)

def busqueda(request):
    if request.method == 'GET':

        search = request.GET.get('search', None)
        titulos = Product.objects.filter(name__contains=search)
        productos = []

        for titulo in titulos:
            productos.append(titulo.name)
        context = {'lista': productos}
        return render(request, "busqueda.html", context)

def formulario_compra(request):
    if request.method == 'POST':
        form = CompraForm(request.POST)
        if form.is_valid():

            cd = form.cleaned_data
            precio1 = Product.objects.all().filter(name__contains=cd['producto1'])[0].price
            precio2 = Product.objects.all().filter(name__contains=cd['producto2'])[0].price
            precio3 = Product.objects.all().filter(name__contains=cd['producto3'])[0].price

            order_price = (precio1 * int(cd['cantidad1'])) + (precio2 * int(cd['cantidad2'])) + (precio3 * int(cd['cantidad3']))

            ord = Compra(usuario=cd['usuario'], direccion=cd['direccion'], metodo_pago=cd['metodo_pago'], producto1=cd['producto1'], cantidad1=cd['cantidad1'], producto2=cd['producto2'], cantidad2=cd['cantidad2'], producto3=cd['producto3'], cantidad3=cd['cantidad3'], precio=order_price)
            ord.save()
            html = '<p>Pedido correcto.</p><a href="/">Volver a la Portad</a>'
            return HttpResponse(html)
    else:
        form = CompraForm()
    return render(request, 'form.html', {'form': form})

def base_datos(request):
    productos = Product.objects.all()
    compra = Compra.objects.all()
    html = '<p>Listado de articulos:</p>'
    for elt in productos:
        html += '<p>nombre= '+ elt.name + '; stock= ' + str(elt.stock) + '; precio= ' + str(elt.price) + '<p>'
    html += '<p>Datos del formulario:</p>'
    for elt in compra:
        html += '<p>usuario= '+ elt.usuario + '; direccion= ' + str(elt.direccion) + '; metodo_pago= ' + str(elt.metodo_pago) + '; producto1= ' + str(elt.producto1) + '; cantidad1= ' + str(elt.cantidad1) + '; producto2= ' + str(elt.producto2) + '; cantidad2= ' + str(elt.cantidad2) + '; producto3= ' + str(elt.producto3) + '; cantidad3= ' + str(elt.cantidad3) + '; precio= ' + str(elt.precio) + '<p>'
    html += '</p><a href="/">Volver a la Portada</a>'
    return HttpResponse(html)
