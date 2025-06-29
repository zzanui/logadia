import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // ✅ 경로 설정을 위해 추가

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // ✅ @ -> src 디렉터리
    }
  },
  server: {
    port: 3000 // 👉 포트도 명시적으로 고정 (선택)
  }
})
