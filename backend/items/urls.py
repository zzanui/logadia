from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, CategoryViewSet, GadianViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'gadians', GadianViewSet, basename='gadian')

urlpatterns = [
    path('', include(router.urls)),
]