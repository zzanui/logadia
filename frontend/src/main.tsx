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

//할 것 : db데이터를 단순히 추가하는 형식으로 진행하면 데이터 중복이 발생(데이터를 중복으로 쌓는것은 큰 의미가 없어보임 / 그렇지만 카게, 가디언, 카게의경우 보상이 조금씩 유동적임 /꾸준히 쌓는 수 밖에 없어보임)., , // db테이블 구조 변경(테이블 명을바꾸면 django에서 migrations가 필요한데 고칠 부분이 너무 많아짐), 가디언페이지로 통합(카드는 별도)
//진행중 : 데이터수집
//끝난 것 : 라우터를 db에 연결하는것은 가능하지면 결국 db에 있는 url과 프론트의 url을 연결하려면 오히려 번거롭고 코드만 봐야할 일을 db까지 봐야하는 귀찮음이 있다. 페이지가 별로 많지 않으므로 단순하게 만드는게 훨씬 효율적으로 보임
//검색 중복 제거,검색 이미지, 키보드 이벤트, 외부 클릭 감지
