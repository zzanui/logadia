# Build
FROM node:18-alpine AS build
WORKDIR /app
ENV CI=false
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund --legacy-peer-deps; \
    else \
      npm install --no-audit --no-fund --legacy-peer-deps; \
    fi

COPY . .
RUN npm run build --loglevel verbose  # → Vite가 /app/dist 생성

# Serve
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
