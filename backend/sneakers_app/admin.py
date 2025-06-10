from django.contrib import admin
from .models import Product, Cart, CartItem, Order, Review



admin.site.register([Product, Cart, CartItem, Order, Review])

