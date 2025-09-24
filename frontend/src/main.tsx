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
  </StrictMode>
)

//할 것 : serach창 메인에 돋보기 아이콘을 추가하여 허전함을 줄이기, 
//진행중 : 데이터조정,
//끝난 것 : db테이블 구조 변경(테이블 명을바꾸면 django에서 migrations가 필요한데 고칠 부분이 너무 많아짐), 검색 방식 변경(검색키워드 생성), 파편 계산 추가, 옥션에 없는 아이템은 0골드가 되도록 수정, 보석 추가(검색필터 : 티어, 레벨)
