import { StrictMode } from 'react' //개발환경에서 2번 실행
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'


import { CategoryProvider } from '@/contexts/CategoryContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CategoryProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </CategoryProvider>
  </StrictMode>,
)

//할 것 : db테이블 구조 변경(테이블 명을바꾸면 django에서 migrations가 필요한데 고칠 부분이 너무 많아짐), serach창 메인에 돋보기 아이콘을 추가하여 허전함을 줄이기, 
//진행중 : 데이터수집, 표기되지않는 경매장에 없는 아이템(실링, 카드경험치 등) 추가(db데이터가 정갈하게 정돈이 되어있지 않아서 생기는 현상 아이템, 평균, 기록 다 확인) // 검색 방식 변경(검색키워드 생성)
//끝난 것 : 페이지 통합 및 라우팅// 검색결과 아이템 -> 카테고리별로 분류
