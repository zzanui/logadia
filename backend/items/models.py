from django.db import models

class Item(models.Model):
    category = models.CharField(max_length=50)
    stage_name = models.CharField(max_length=50)
    stage_level = models.IntegerField()
    entry_level = models.IntegerField()
    item_name = models.CharField(max_length=50)
    quantity = models.IntegerField()
    binding = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.item_name}"

class Category(models.Model):
    ko_name = models.CharField(max_length=50)
    en_name = models.CharField(max_length=50, blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    def __str__(self):
        return self.name
    
#보상db를 별도로 만드는게 좋아보임
class Gadian(models.Model):
    ko_name = models.CharField(max_length=50)
    en_name = models.CharField(max_length=50, blank=True)
    level = models.IntegerField()
    kind = models.CharField(max_length=20, blank=True, null=True)
    stage = models.CharField(max_length=20, blank=True, null=True)
    vulnerable_properties = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='gadians/', blank=True, null=True)

    