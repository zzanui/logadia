from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Item, Category, Gadian
from .serializers import ItemSerializer, CategorySerializer, GadianSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    # 필터링, 정렬, 검색 기능을 추가
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = [ 'ko_neame', 'en_name', 'tear']
    ordering_fields = [ 'id', 'tear']


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    filterset_fields = ['category']
    ordering_fields = ['category']

class GadianViewSet(viewsets.ModelViewSet):
    queryset = Gadian.objects.all()
    serializer_class = GadianSerializer

    # 필터링, 정렬, 검색 기능을 추가
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['ko_name', 'en_name', 'level', 'kind', 'stage']
    ordering_fields = ['id', 'level', 'stage']
    search_fields = ['ko_name', 'en_name','activation']
