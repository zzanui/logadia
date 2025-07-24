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

//할 것 : 사진조정, 아게오로스 추가, 사이드바에 필터 생성, 재료 검색 추가, 햄버거
//진행중 : 
//끝난 것 :   *페이지네이션, *헤더,푸터 따라오기