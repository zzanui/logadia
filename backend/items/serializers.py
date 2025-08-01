from rest_framework import serializers
from .models import Item, Category, Gadian, GadianItemAverage

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    
    class Meta:
        model = Category
        fields = '__all__'

class GadianSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Gadian
        fields = '__all__'
        read_only_fields = ['ko_name', 'en_name', 'level', 'kind', 'stage', 'vulnerable_properties', 'category']

class GadianItemAverageSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    gadian = GadianSerializer(read_only=True)

    class Meta:
        model = GadianItemAverage
        fields = '__all__'
        read_only_fields = ['gadian', 'item', 'average_count', 'binding']


class ItemAutoCompleteSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ['ko_name', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None