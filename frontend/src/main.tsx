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

//할 것 : 사이드바에 필터 생성, db데이터를 단순히 추가하는 형식으로 진행하면 데이터 중복이 발생한다., db테이블 구조 변경,  가디언 중복 제거
//진행중 : 
//끝난 것 : 햄버거, 아게오로스 추가, 사진조정, 재료 검색 추가, 검색창 자동완성 추가(정해진 내용만 검색가능)