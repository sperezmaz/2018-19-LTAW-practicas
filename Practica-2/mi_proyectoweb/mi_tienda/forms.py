from django import forms
from mi_tienda.models import Product

class CompraForm(forms.Form):
    usuario = forms.CharField(max_length=200)
    direccion = forms.CharField(max_length=200)
    opc1 = [("paypal", "paypal"), ("tarjeta de crédito", "tarjeta de crédito"), ("transferencia bancaria", "transferencia bancaria")]

    metodo_pago = forms.ChoiceField(choices=opc1 , label="Choices")
    products = Product.objects.all()
    n = 1
    for p in products:
        opc2 = []
        dispo = p.stock
        while dispo > 0:
            opc2.append((dispo , dispo))
            dispo -= 1
        exec('producto{} = forms.ChoiceField(choices=[(p.name, p.name)] , label="Choices")'.format(n))
        exec('cantidad{} = forms.ChoiceField(choices=opc2 , label="Choices")'.format(n))
        n += 1
