
import GadianCard from '@/components/GadianCard'
import { GadianProvider } from '@/contexts/GadianContext';
import { useEffect, useState } from 'react';

import {fetchGadian} from '@/api/api';

//프론트에서 필터링을 위해 사용하는 가디언 타입 정의
// 보상 아이템을 별도의 보상 카드를 만들어 추가 -> 낭비가 심하다 가디언카드에 보상칸을 같이 만들자
// 5개 이상의 가디언을 보고싶은 경우 더보기 버튼 추가



type Gadian = {
  ko_name: string
  level: string
  vulnerable_properties: string
  kind: string
  stage: string
  items: string[]
  imageUrl: string
}

const Gadian: React.FC = () => {
  // 가디언 데이터를 저장할 상태 변수
  const [gadiansData, setGadiansData] = useState<Gadian[]>([]);
  // 초기화 시 가디언 데이터를 가져오는 함수
  useEffect(() => {
    fetchGadian().then(setGadiansData).catch(console.error);
  }, []);
 
  return (
    <GadianProvider>
      <main className="px-4 py-8 flex flex-wrap justify-center gap-8">
        {gadiansData.map((card, idx) => (
          <GadianCard key={idx} {...card} /> 
        ))}
      </main>
    </GadianProvider>
    )
  }

export default Gadian
