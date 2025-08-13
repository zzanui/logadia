from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, CategoryViewSet, ContentViewSet, ContentItemPriceInfoView, SearchItemAverageView, ItemAutoCompleteView

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'contents', ContentViewSet, basename='content')

urlpatterns = [
    path('', include(router.urls)),
    path('prices/', ContentItemPriceInfoView.as_view(), name='content-item-prices'),
    path('search/', SearchItemAverageView.as_view(), name='search-items'),
    path("autocomplete/", ItemAutoCompleteView.as_view(), name="item-autocomplete"),

]