import { useState, useEffect } from 'react'
import RewardCard from './RewardCard'

type Reward = {
  item_name: string
  item_image: string
  item_count: number
  calculated_price: number
}

interface CardProps {
  ko_name: string
  level: string
  vulnerable_properties: string
  kind: string
  stage: string
  items: Reward[]
  image: string
}
 
const GadianCard: React.FC<CardProps> = ({
  ko_name,
  level,
  vulnerable_properties,
  kind,
  stage,
  items = [],
  image
}) => {
  // const [selected, setSelected] = useState<boolean[]>([])//아이템 체크박스
  const [selected, setSelected] = useState<boolean[]>([])//아이템 체크박스
  const [useRestGauge, setUseRestGauge] = useState<boolean>(false)// 휴식게이지 여부 체크박스

  // 아이템 초기체크 설정
  useEffect(() => {
    setSelected(new Array(items.length).fill(true))
  }, [items])

  const toggleCheck = (index: number) => {
    setSelected((prev) => {
      const copy = [...prev]
      copy[index] = !copy[index]
      return copy
    })
  }

  const totalPrice = items.reduce((sum, item, idx) => {
    if (!selected[idx]) return sum
    const price = useRestGauge ? item.calculated_price * 2 : item.calculated_price
    return sum + price
  }, 0)


  return (
    <div className="max-w-6xl w-full flex bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
      {/* 좌측 이미지
      <div className="w-80 flex-none bg-black flex justify-center items-center overflow-hidden">
        <img
          src={image}
          alt={ko_name}
          className="w-full h-full object-contain"
        />
      </div> */}

      {/* 중앙 가디언정보 */}
        <div className="p-4 basis-1/3 shrink-0 min-w-0">
        <div>
          <div className="text-gray-900 font-bold text-xl mb-1">{ko_name}</div>
          <p className="text-gray-700 text-sm mb-1">{kind}: {stage}</p>
          <p className="text-gray-700 text-sm mb-1">레벨: {level}</p>
          <p className="text-gray-700 text-sm mb-1">약점 속성: {vulnerable_properties}</p>

        
            <label className="mt-2 text-sm text-gray-700 flex items-center gap-2">
              <input
                type="checkbox"
                checked={useRestGauge}
                onChange={(e) => setUseRestGauge(e.target.checked)}
                className="w-5 h-5 accent-blue-600 cursor-pointer rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              휴식 게이지 사용여부
            </label>
          </div>
      </div>
      

      {/* 오른쪽: 보상 카드 목록 */}
      <div className="p-4 basis-2/3 grow-0 shrink-0 border-l border-gray-200">
        <p className="text-sm font-semibold text-gray-800 mb-1">보상 아이템</p>
        
        <div className="grid grid-cols-3 gap-2">
          {items.map((item, index) => {
            const adjustedCount = useRestGauge ? item.item_count * 2 : item.item_count
            const adjustedPrice = useRestGauge ? item.calculated_price * 2 : item.calculated_price

            return (
              <RewardCard
                key={index}
                name={item.item_name}
                image={item.item_image}
                count={adjustedCount}
                price={adjustedPrice}
                checked={selected[index]}
                onCheck={() => toggleCheck(index)}
              />
            )
          })}
        </div>


        <div className="mt-4 text-right text-sm text-gray-700 font-semibold">
          총 골드: {totalPrice.toLocaleString()}G
        </div>
      </div>
    </div>
  
  )
}

export default GadianCard
