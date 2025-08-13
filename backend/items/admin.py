from django.contrib import admin
from .models import Item, Category, Content, ContentItemHistory, ContentItemAverage

admin.site.register(Item)
admin.site.register(Category)
admin.site.register(Content)
admin.site.register(ContentItemAverage)
admin.site.register(ContentItemHistory)


 