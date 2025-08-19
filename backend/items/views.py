from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import OuterRef, Subquery, Max

from .models import Item, Category, Content, ContentItemAverage, ActionItem
from .serializers import ItemSerializer, CategorySerializer, ContentSerializer, ContentItemAverageSerializer, ItemAutoCompleteSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    # 필터링, 정렬, 검색 기능을 추가
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = [ 'ko_name', 'en_name', 'tear']
    ordering_fields = [ 'id', 'tear']

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    filterset_fields = ['category']
    ordering_fields = ['category']

class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.filter(activation=True)# 활성화된 콘텐츠만 조회 
    serializer_class = ContentSerializer

    # 필터링, 정렬, 검색 기능을 추가
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['category_id', 'ko_name', 'en_name', 'level', 'kind', 'stage']
    ordering_fields = ['id', 'level', 'stage']
    search_fields = ['ko_name', 'en_name']


#예상 보상골드 가격 책정api
class ContentItemPriceInfoView(APIView):
    def get(self, request):
        content_ids = request.query_params.getlist('content_id')
        if not content_ids:
            return Response({"error": "content_id is required"}, status=400)

        results = []

        for content_id in content_ids:
        # Step 1: 같은 item에 대해 가장 최신 date만 필터링
            latest_date_subquery = ContentItemAverage.objects.filter(
                content_id=content_id,
                #OuterRef는 Django ORM에서 서브쿼리(Subquery)를 사용할 때 외부 쿼리의 값을 참조하기 위해 사용하는 특수 객체
                item=OuterRef('item')
            ).order_by('-date')

            latest_averages = ContentItemAverage.objects.filter(
                content_id=content_id,
                date=Subquery(latest_date_subquery.values('date')[:1])
            ).select_related('item')
        

            for avg in latest_averages:
                # 2. 각 아이템의 최신 거래 정보 (ActionItem)
                action = ActionItem.objects.filter(item=avg.item).order_by('-created_at').first()
                if not action or not action.bundleCount or not action.current_min_price:
                    action_price = 0
                    total_price = 0
                else: 
                    # 3. 계산: 평균 개수 / 묶음 수 * 현재 최저가
                    action_price = action.current_min_price
                    total_price = (avg.average_count / action.bundleCount) * action.current_min_price

                results.append({
                    "content_id": int(content_id),
                    "item_name": avg.item.ko_name,
                    "item_image": request.build_absolute_uri(avg.item.image.url) if avg.item.image else None,
                    "item_count": avg.average_count,
                    "action_price": action_price,
                    "calculated_price": round(total_price, 2),
                })

        return Response(results)
    
# 아이템 검색 시 해당 아이템의 획득처를 반환하는 API
class SearchItemAverageView(APIView):#여기 수정
    def get(self, request):
        query = request.GET.get("search_keyword", "")
        if not query:
            return Response({"error": "item_keyword 쿼리가 필요합니다."}, status=400)
        # 아이템 이름으로 필터링
        results = ContentItemAverage.objects.filter(item__ko_name=query)

        #최신 날짜 기준으로 필터링
        latest_date_subquery = (
            ContentItemAverage.objects
            .filter(item=OuterRef('item'))
            .values('item')
            .annotate(latest_date=Max('date'))
            .values('latest_date')[:1]
        )

        latest_records = results.filter(date=Subquery(latest_date_subquery))
        
        serializer = ContentItemAverageSerializer(latest_records, many=True)
        return Response(serializer.data)
    

# 아이템 자동완성 기능을 위한 API
class ItemAutoCompleteView(APIView):
    def get(self, request):
        keyword = request.query_params.get("item_keyword", "")
        if not keyword:
            return Response([])

        queryset = Item.objects.filter(ko_name__icontains=keyword)[:5]# 제한된 개수로 검색
        serializer = ItemAutoCompleteSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)