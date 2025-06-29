from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Item, Category, Gadian
from .serializers import ItemSerializer, CategorySerializer, GadianSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]


    filterset_fields = ['category', 'stage_name', 'entry_level', 'item_name']
    ordering_fields = ['quantity', 'entry_level']


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    filterset_fields = ['category']
    ordering_fields = ['category']

class GadianViewSet(viewsets.ModelViewSet):
    queryset = Gadian.objects.all()
    serializer_class = GadianSerializer

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['ko_name', 'en_name', 'level', 'kind', 'stage']
    ordering_fields = ['ko_name', 'en_name', 'level']
    search_fields = ['ko_name', 'en_name']
