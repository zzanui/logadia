# 로가디아 (Logadia)

> **로스트아크 콘텐츠 보상 가치 확인 서비스**  
> 개발기간: 2025.07 ~  
> 참여인원: 1인  
> 역할: 기획 · 설계 · 개발 · 배포 전 과정 담당  
<img width="412" height="424" alt="1" src="https://github.com/user-attachments/assets/fca119f0-8b69-492f-941a-943bf2461540" />
<img width="412" height="424" alt="2" src="https://github.com/user-attachments/assets/2b78c8d4-460a-413d-8bae-7cdc47763682" />

---

## 프로젝트 개요

**로가디아(Logadia)** 는 게임 **로스트아크(Lost Ark)** 의 콘텐츠 보상 가치를 거래소 시세 기준으로 실시간 환산하여 보여주는 웹 서비스입니다.  
사용자는 특정 콘텐츠 수행 시 획득 가능한 아이템의 가치를 인게임 화폐(골드) 기준으로 확인할 수 있습니다.

---

## 개발 배경 및 목적

- 로스트아크의 각 콘텐츠는 다양한 보상을 제공하지만 **실제 골드 가치 비교 수단이 없었음**
- 거래 불가능 아이템은 가치를 직관적으로 파악하기 어려움
- 유저가 효율적인 콘텐츠 선택을 할 수 있도록 **모든 보상 아이템을 골드 단위로 환산**하는 서비스 개발

> 기존 유사 서비스인 **"로스트골드"** 는 거래 가능한 재료만 다루지만,  
> **로가디아는 비거래 아이템까지 포함한 포괄적 정보를 제공**합니다.

---

## 핵심 가치

| 핵심 포인트 | 설명 |
|--------------|------|
| 실시간 시세 반영 | 15분 주기 거래소 API 동기화 |
| 포괄적 정보 | 거래 불가능 아이템 포함 |
| 효율 극대화 | 콘텐츠별 골드 가치 비교를 통한 최적 플레이 지원 |

---

## 기술 스택

| 구분 | 기술 | 설명 |
|------|------|------|
| **Backend** | Django REST Framework (Python 3.12) | API 서버 구축 |
| **Frontend** | React (TypeScript, Vite) | SPA 기반 UI 구현 |
| **Database** | PostgreSQL | 정규화된 콘텐츠/아이템/거래소 데이터 관리 |
| **Infra** | Docker, Docker Compose | 컨테이너 기반 개발 및 배포 환경 |
| **Server** | AWS EC2 (Ubuntu 22.04) | HTTPS 배포 및 운영 |
| **Web Server** | Nginx + Certbot | SSL 인증서 발급 및 리버스 프록시 구성 |

---

## 주요 기술 구현 요약

### 1. 데이터 구조 및 정규화 설계
- `Content`, `Item`, `ItemPrice`, `ContentItemAverage` 테이블 직접 설계  
- 보상 데이터의 **난수성 처리 → 평균화 후 실시간 API와 결합**
- 오타 및 중복 방지를 위해 **아이템 테이블 분리 + 조인 관리**

### 2. API 서버 개발 (DRF)
- 콘텐츠, 아이템, 평균 보상 조회 API 구현
- `/api/prices/?content_id={id}` 형태로 **콘텐츠별 골드 가치 반환**
- 실시간 시세 반영 기능 직접 구현

### 3. 데이터 적재 자동화
- 리눅스 **crontab** 을 활용해 15분마다 거래소 API 데이터 자동 적재

### 4. 배포 및 서버 구성
- `backend`, `db`, `nginx` 로 구성된 **Docker Compose 환경 구축**
- AWS EC2에 **HTTPS 배포 (Certbot + Nginx)**
- **Swap 4GB 설정**으로 OOM(Out Of Memory) 문제 해결

### 5. 보안 및 확장성
- `.env` 환경변수 분리 및 `.gitignore` 관리
- 향후 **Elasticsearch 기반 오타 교정, WAF, Rate Limit 도입 예정**

---

## 시스템 아키텍처


[React] ⇄ [Nginx] ⇄ [Gunicorn + Django API] ⇄ [PostgreSQL], [redis]
↑
(Crontab: 15분 주기 거래소 API 동기화)
<div align="center">
  <img width="1548" height="802" alt="image" src="https://github.com/user-attachments/assets/7d38513a-c4ca-48da-a2e4-589c22155793" />

</div>

---
## ERD
<div align="center">
  <img width="512" height="404" alt="erd" src="https://github.com/user-attachments/assets/7e0001ff-7f6a-4b7d-8a95-3a1a67f335b7" />
</div>

---


## 주요 기능

### 1) 콘텐츠별 보상 가치 조회
- 각 콘텐츠에서 획득 가능한 아이템 목록 제공  
- 평균 보상 수량 × 실시간 거래소 가격 기반 **총 골드 가치 계산**
- 난수형 드랍 아이템은 누적 기록을 평균값으로 정규화하여 표시

---

### 2) 아이템 역검색 기능
- 검색창에서 아이템명을 입력하면  
  → 해당 아이템을 드랍하는 모든 콘텐츠 목록을 자동 조회  
- 아이템별 평균 획득량, 바인딩 여부, 가치 등 상세 정보 제공

---

### 3) 실시간 시세 15분 자동 반영
- crontab 스케줄링으로 15분마다 거래소 API 호출  
- `ItemPrice` 테이블에 최신 시세 자동 적재  
- 사용자는 **항상 최신 기준**의 골드 가치를 확인할 수 있음

---

### 4) API 기반 데이터 제공 (DRF)
- 프론트엔드는 API 기반으로 모든 정보를 조회  
- RESTful 구조로 React와 완전 분리되어 확장성 우수

---

## Docker Compose 설정

```
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    depends_on:
      - db

  db:
    image: postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
```

## CSV → DB 적재 코드 예시

- 아래 코드는 구글 시트에서 정리한 CSV 데이터를 Django ORM을 통해 `ContentItemAverage` 테이블에 적재하는 예시입니다.
  
```
import pandas as pd
from datetime import date
from .models import Content, Item, ContentItemAverage


def load_csv_to_get_content_item(file_path: str) -> None:
    """
    콘텐츠 보상 CSV 데이터를 ContentItemAverage 테이블에 적재하는 함수.

    CSV 컬럼 예시:
    - id
    - 이름: 콘텐츠 한글명
    - 아이템: 아이템 한글명
    - 아이템표기: 실제 UI에서 보여줄 이름
    - 갯수: 평균 획득 수량
    - 귀속여부: O / X
    """

    today = date.today()

    def to_bool(val):
        return str(val).strip() == "O"

    df = pd.read_csv(file_path)

    for _, row in df.iterrows():
        content_obj = Content.objects.get(ko_name=row["이름"].strip())
        item_obj = Item.objects.get(ko_name=row["아이템"].strip())

        ContentItemAverage.objects.create(
            id=row["id"],
            content_id=content_obj.id,
            item_id=item_obj.id,
            item_name=row["아이템표기"],
            average_count=row["갯수"],
            binding=to_bool(row["귀속여부"]),
            date=today,
        )

    print("CSV → DB 데이터 적재 완료")

```

## API 요약

| No | 모델 | URL | 설명 |
|----|------|------|------|
| 1 | Item | `/api/items/` | 아이템 전체 목록 |
| 2 | Category | `/api/categories/` | 아이템 카테고리 |
| 3 | Content | `/api/contents/` | 콘텐츠 목록 |
| 4 | ContentItemAverage | `/api/prices/` | 평균 보상 + 골드 가치 |

---

### 요청 예시

```
GET /api/prices/?content_id=31
```
### 응답 예시

```
{
  "content_id": 31,
  "item_name": "운명의 파괴석",
  "item_count": 350.5,
  "action_price": 41,
  "calculated_price": 143.7
}
```

---

## UI 구성

### 콘텐츠 카드 UI
- 콘텐츠명
- 입장 레벨
- 주요 드랍 아이템
- 콘텐츠 골드 가치

### 아이템 검색 화면
- 아이템명 입력  
→ 드랍 가능한 모든 콘텐츠를 자동 조회  
→ 평균 획득 개수 & 가치 제공

> 초기에는 필터 방식 고려 →  
> 유저 경험상 **아이템 기반 역검색**이 더 실용적이라 변경

## 배포 및 운영

### AWS EC2 기반 운영
- Ubuntu 22.04
- 포트 22 / 80 / 443 오픈

### Docker Compose 구성
- backend, db, nginx 컨테이너 사용

### HTTPS 적용
- Nginx + Certbot 조합

### 데이터 자동 업데이트
- Linux crontab  
→ 15분마다 거래소 API 호출  
→ 최신 아이템 시세 반영

### 메모리 안정화
- 빌드 중 OOM 발생  
→ Swap 4GB 추가해 해결

## Nginx 핵심 설정

```
http {
  upstream django {
    server web:8000;
  }

  # HTTP → HTTPS 자동 리다이렉트
  server {
    listen 80;
    server_name logadia.co.kr;

    location / {
      return 301 https://$host$request_uri;
    }
  }

  # HTTPS 실제 서비스
  server {
    listen 443 ssl http2;
    server_name logadia.co.kr;

    ssl_certificate     /etc/letsencrypt/live/logadia.co.kr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/logadia.co.kr/privkey.pem;

    # React 정적 파일
    location / {
      root /usr/share/nginx/html;
      try_files $uri /index.html;
    }

    # Django REST API
    location /api/ {
      proxy_pass http://django;
    }
  }
}

```

---



## 향후 개선 계획

1. 신규 콘텐츠 / 아이템 자동 업데이트 기능  
2. Elasticsearch + Fuzzy Search 기반 오타 검색  
3. GitHub Actions / Jenkins CI/CD 구축  
4. Cloudflare 또는 AWS WAF 적용  
5. 가격 변동 알림 기능 추가  

---

## 회고

- 정규화 설계의 중요성을 크게 체감  
- Docker, SSL, 인프라 구성 등 운영 전반을 직접 경험  
- 실제 유저 피드백 기반으로 기능을 고도화할 수 있었음  

---

