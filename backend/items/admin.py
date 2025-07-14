from django.contrib import admin
from .models import Item, Category, Gadian, GadianItemHistory, GadianItemAverage

admin.site.register(Item)
admin.site.register(Category)
admin.site.register(Gadian)
admin.site.register(GadianItemAverage)
admin.site.register(GadianItemHistory)


 