import pandas as pd
from items.models import *

def load_csv_to_items(file_path):
    df = pd.read_csv(file_path)
    for _, row in df.iterrows():
        Item.objects.create(
            category=row['category'],
            stage_name=row['stage_name'],
            stage_level=int(row['stage_level']),
            entry_level=int(row['entry_level']),
            item_name=row['item_name'],
            quantity=int(str(row['quantity']).replace(',', '')),
            binding=row['binding']
        )
    print("✅ CSV 데이터베이스 적재 완료")

# 실행 예제:
# python manage.py shell
# >>> from load_csv import load_csv_to_items
# >>> load_csv_to_items("items.csv")
# ✅ CSV 데이터베이스 적재 완료


def load_csv_to_gadian(file_path):
    df = pd.read_csv(file_path)
    for _, row in df.iterrows():
        Gadian.objects.create(
            ko_name=row['한글명'],
            en_name=row['영문명'].replace(' ', '_'),
            level=row['레벨'],
            kind=row['종류'],
            stage=row['단계'],
            vulnerable_properties=row['취약속성'],
            # 이미지 필드가 있다면 주석 해제
            # image=row['이미지'],
        )
    print("✅ CSV 데이터베이스 적재 완료")

# 실행 예제:
# python manage.py shell
# >>> from load_csv import load_csv_to_gadian
# >>> load_csv_to_gadian("gadian.csv")
# ✅ CSV 데이터베이스 적재 완료