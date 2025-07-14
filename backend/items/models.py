from django.db import models

 
"""
# \/아이템 모델\/

# 한글명,
# 영문명,
# 등급(일반,고급,희귀,영웅,전설,유물,고대)
"""
class Item(models.Model):
    ko_name = models.CharField(max_length=50)
    en_name =  models.CharField(max_length=50, blank=True, null=True)
    tear = models.CharField(max_length=20, blank=True, null=True)  
    image = models.ImageField(upload_to='items/', blank=True, null=True)



    def __str__(self):
        return f"{self.ko_name}"

#카테고리
class Category(models.Model):
    ko_name = models.CharField(max_length=50)
    en_name = models.CharField(max_length=50, blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    def __str__(self):
        return self.en_name
    
"""
# \/가디언 모델\/

# 한글명, 
# 영문명, 
# 입장레벨, 
# 종류(정화,시련), 
# 단계(1~6), 
# 취약속성(화,수,토,암,명), 
# 이미지, 
# 활성화여부
"""
class Gadian(models.Model):
    ko_name = models.CharField(max_length=50)
    en_name = models.CharField(max_length=50, blank=True)
    level = models.IntegerField()
    kind = models.CharField(max_length=20, blank=True, null=True)
    stage = models.CharField(max_length=20, blank=True, null=True)
    vulnerable_properties = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='gadians/', blank=True, null=True)
    activation = models.BooleanField(default=True)#사용하지 않는 가디언은 비 활성화
    
    def __str__(self):
        return self.en_name
     


"""
# \/가디언 보상 모델\/

# 가디언(외래키),
# 아이템(외래키),
# 아이템 개수,
# 아이템 귀속여부
# 생성일시,
"""
#데이터가 없으므로 임시로 4티어 가디언만 임시로 데이터 축적하자, 매일매일 데이터 축적 테이블에서 평균을 구한 후 평균값을 도출 한 후 보상테이블에 추가하는 방식으로 진행 
class GadianItemAverage(models.Model):
    gadian = models.ForeignKey(Gadian , on_delete=models.PROTECT)
    item = models.ForeignKey(Item, on_delete=models.PROTECT)  
    average_count = models.IntegerField()  # 아이템 개수
    binding = models.BooleanField(default=False)  # 아이템 귀속여부
    date = models.DateField()  # 저장 날짜

    class Meta:
        # 유니크 제약조건 설정
        # 같은 가디언, 아이템, 귀속여부, 날짜 조합은
        # 중복 저장되지 않도록 설정
        unique_together = ('gadian', 'item', 'binding', 'date')
        indexes = [
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.gadian.ko_name} | {self.item.ko_name} | {self.created_at.strftime('%Y-%m-%d')}"
    


# 가디언 보상 기록
"""
# 가디언(외래키),
# 아이템(외래키),
# 아이템 개수,
# 아이템 귀속여부
# 휴식 게이지,
# 출처,
# 생성일시, 
"""
class GadianItemHistory(models.Model):
    Gadian = models.ForeignKey(Gadian, on_delete=models.PROTECT)#가디언
    item = models.ForeignKey(Item, on_delete=models.PROTECT)#아이템
    count = models.IntegerField(default=0)#아이템 개수
    binding = models.BooleanField(default=False)#아이템 귀속여부
    rest_gage = models.BooleanField(default=False)#휴식 게이지
    source = models.CharField(max_length=50, blank=True, null=True)#출처
    created_at = models.DateTimeField(null=True)#생성일시
    def __str__(self):
        return f"{self.Gadian.ko_name} | {self.item.ko_name} | {self.created_at.strftime('%Y-%m-%d')}"
