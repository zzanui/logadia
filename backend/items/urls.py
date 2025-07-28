from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, CategoryViewSet, GadianViewSet, GadianItemPriceInfoView, SearchItemAverageView, ItemAutoCompleteView

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'gadians', GadianViewSet, basename='gadian')

urlpatterns = [
    path('', include(router.urls)),
    path('prices/', GadianItemPriceInfoView.as_view(), name='gadian-item-prices'),
    path('search/', SearchItemAverageView.as_view(), name='search-items'),
    path("autocomplete/", ItemAutoCompleteView.as_view(), name="item-autocomplete"),

]