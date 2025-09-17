FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DEFAULT_TIMEOUT=120

WORKDIR /app

# 최신 툴체인
RUN python -m pip install --upgrade pip setuptools wheel

# 바이너리 휠 우선(apt 없이 설치)
RUN pip install --only-binary=:all: --prefer-binary \
    "psycopg[binary]>=3.1" \
    "numpy>=2" \
    "pandas>=2" \
    "pillow>=10"

# 나머지 의존성
COPY requirements.txt .
RUN pip install --prefer-binary -r requirements.txt

# 앱 복사
COPY . .
# 실행은 compose의 command에서 (migrate + collectstatic + gunicorn)
