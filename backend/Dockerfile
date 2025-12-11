# 더 많은 바이너리 휠이 준비된 3.11로 보수적으로 (3.12도 가능하지만 3.11이 실패 확률 낮음)
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DEFAULT_TIMEOUT=120

WORKDIR /app

# pip 툴체인 최신화
RUN python -m pip install --upgrade pip setuptools wheel

# 의존성 설치 (requirements.txt에는 psycopg[binary]로 교체되어 있어야 함)
COPY requirements.txt .
RUN pip install --prefer-binary -r requirements.txt

# 앱 복사
COPY . .
# 실행은 compose의 command에서 (migrate + collectstatic + gunicorn)
