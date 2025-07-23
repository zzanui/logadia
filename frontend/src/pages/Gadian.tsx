
import GadianCard from '@/components/GadianCard'
import { GadianProvider } from '@/contexts/GadianContext';
import { useEffect, useState } from 'react';
import {fetchGadian, fetchGadianRewards} from '@/api/api';

//프론트에서 필터링을 위해 사용하는 가디언 타입 정의
// 보상 아이템을 별도의 보상 카드를 만들어 추가 -> 낭비가 심하다 가디언카드에 보상칸을 같이 만들자
// 5개 이상의 가디언을 보고싶은 경우 더보기 버튼 추가



type Gadian = {
  id: number
  ko_name: string
  level: string
  vulnerable_properties: string
  kind: string
  stage: string
  imageUrl: string
}


// 리 월~드를 받아야게쮜?
type Reward = {
  gadian_id: number
  item_name: string
  item_image: string
  item_count: number
  calculated_price: number
}

type GadianWithItems = Gadian & { items: Reward[] }

const Gadian: React.FC = () => {
  // 가디언 데이터를 저장할 상태 변수
  const [gadiansData, setGadiansData] = useState<GadianWithItems []>([]);

  // 초기화 시 가디언 데이터를 가져오는 함수
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const gadians: Gadian[] = await fetchGadian()

        const withItems: GadianWithItems[] = await Promise.all(
          gadians.map(async (gadian) => {
            const rewards: Reward[] = await fetchGadianRewards(gadian.id)
            return { ...gadian, items: rewards }
          })
        )

        setGadiansData(withItems)
      } catch (err) {
        console.error('가디언 데이터 전체 로딩 실패', err)
      }
    }

    fetchAll()
  }, [])
 


  
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
