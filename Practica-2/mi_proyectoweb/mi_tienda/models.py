from django.db import models

# Create your models here.
class Product (models.Model):
    name = models.CharField(max_length=200)
    stock = models.IntegerField()
    price = models.FloatField()
    imagen = models.ImageField(default='lenovo.jpg')
    video = models.FileField(default='lenovo.mp4')
    audio = models.FileField(default='macbook.mp3')

class Compra (models.Model):

    usuario = models.CharField(max_length=200)
    direccion = models.CharField(max_length=200)
    metodo_pago = models.CharField(max_length=200)
    producto1 = models.CharField(max_length=200)
    cantidad1 = models.IntegerField()
    producto2 = models.CharField(max_length=200)
    cantidad2 = models.IntegerField()
    producto3 = models.CharField(max_length=200)
    cantidad3 = models.IntegerField()
    precio = models.FloatField()
