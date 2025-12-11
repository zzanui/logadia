# 리포트: EC2(Docker 컨테이너)에서 Django 함수 15분마다 자동 실행하기

## 1. 배경
- 실행하고 싶은 함수: `insertDB.tasks.save_action_item`  
- 특이사항: 이 함수는 **Django ORM**을 사용 → 반드시 **Django 컨테이너 내부**에서 실행되어야 함.  
- 목표: EC2 서버에서 **15분마다** 이 함수를 자동으로 실행.

---

## 2. 해결 전략
1. **수동 실행 확인**  
   컨테이너 안에서 `manage.py shell -c ...` 명령어로 함수를 실행할 수 있는지 먼저 테스트.
   ```bash
   docker compose exec -T web python manage.py shell -c 'from insertDB.tasks import save_action_item; save_action_item()'
   ```
   - 여기서 `web`은 docker-compose.yml에 정의된 Django 서비스 이름.
   - 이 명령이 성공해야 자동화도 성공.

2. **systemd 서비스/타이머 사용**  
   EC2 Ubuntu에서 `systemd`의 **timer**를 이용해 15분마다 명령어를 실행하도록 설정.

---

## 3. 구체적인 과정

### 3-1) 서비스 파일 작성
경로: `/etc/systemd/system/save-action-item.service`
```ini
[Unit]
Description=Run Django save_action_item inside Docker
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
User=ubuntu
WorkingDirectory=/srv/logadia
ExecStart=/bin/bash -lc 'flock -n /tmp/save_action_item.lock timeout 600 docker compose --project-directory /srv/logadia exec -T web python manage.py shell -c "from insertDB.tasks import save_action_item; save_action_item()"'
```

- `WorkingDirectory`: `docker-compose.yml` 있는 디렉토리 (`/srv/logadia`)  
- `web`: Django 서비스 이름 (다르면 변경)  
- `flock`: 실행이 겹치지 않게 잠금  
- `timeout 600`: 10분 이상 걸리면 강제 종료  

---

### 3-2) 타이머 파일 작성
경로: `/etc/systemd/system/save-action-item.timer`
```ini
[Unit]
Description=Run save_action_item every 15 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=15min
Persistent=true

[Install]
WantedBy=timers.target
```

- 부팅 2분 후 첫 실행  
- 이후 15분마다 반복  

---

### 3-3) systemd 적용
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now save-action-item.timer
```

- `daemon-reload`: 새 서비스/타이머 파일 반영  
- `enable --now`: 부팅 시 자동 실행 + 즉시 시작  

---

## 4. 테스트 방법

### 4-1) 즉시 실행
```bash
sudo systemctl start save-action-item.service
```

### 4-2) 실행 결과 확인
```bash
journalctl -u save-action-item.service -n 50 --no-pager
```

- 로그에 `save_action_item` 실행 관련 출력이 있으면 정상 동작  

### 4-3) 타이머 상태 확인
```bash
systemctl list-timers | grep save-action-item
```

- `15min` 간격으로 스케줄링 되어 있음을 확인 가능  

---

## 5. 결론
- 관리 커맨드(`python manage.py save_action_item`)를 만들지 않고, **직접 import 실행 방식**으로 자동화를 완료.  
- EC2 Ubuntu의 **systemd timer**가 15분마다 컨테이너 안에서 함수를 실행하도록 구성.  
- `flock`과 `timeout`으로 중복 실행과 무한 대기 문제를 방지.  
- 정석 방식(관리 커맨드 작성)은 선택 사항이며, 현재 방식으로도 충분히 안정적으로 동작.
