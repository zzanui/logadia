from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import OuterRef, Subquery, Q

from .models import Item, Category, Gadian, GadianItemAverage, ActionItem
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


class GadianItemPriceInfoView(APIView):
    def get(self, request):
        gadian_ids = request.query_params.getlist('gadian_id')
        if not gadian_ids:
            return Response({"error": "gadian_id is required"}, status=400)

        results = []

        for gadian_id in gadian_ids:
        # Step 1: 같은 item에 대해 가장 최신 date만 필터링
            latest_date_subquery = GadianItemAverage.objects.filter(
                gadian_id=gadian_id,
                #OuterRef는 Django ORM에서 서브쿼리(Subquery)를 사용할 때 외부 쿼리의 값을 참조하기 위해 사용하는 특수 객체
                item=OuterRef('item')
            ).order_by('-date')

            latest_averages = GadianItemAverage.objects.filter(
                gadian_id=gadian_id,
                date=Subquery(latest_date_subquery.values('date')[:1])
            ).select_related('item')
        

            for avg in latest_averages:
                # 2. 각 아이템의 최신 거래 정보 (ActionItem)
                action = ActionItem.objects.filter(item=avg.item).order_by('-created_at').first()
                if not action or action.bundleCount == 0:
                    continue  # 거래 정보 없음 or 0으로 나누는 문제 방지

                # 3. 계산: 평균 개수 / 묶음 수 * 현재 최저가
                total_price = (avg.average_count / action.bundleCount) * action.current_min_price

                results.append({
                    "gadian_id": int(gadian_id),
                    "item_name": avg.item.ko_name,
                    "item_image": request.build_absolute_uri(avg.item.image.url) if avg.item.image else None,
                    "item_count": avg.average_count,
                    "action_price": action.current_min_price,
                    "calculated_price": round(total_price, 2),
                })

        return Response(results)