import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useCategoryContext } from '@/contexts/CategoryContext'

import { fetchGadiansPage, fetchGadianRewards } from '@/api/api'

import GadianCard from '@/components/GadianCard'
import KurzanCard from '@/components/KurzanCard'
import FieldBossCard from '@/components/FieldBossCard'
import DungeonCard from '@/components/DungeonCard'

const Gadian = () => {
  // 상태 변수 선언
  const [gadians, setGadians] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(true)
  const [loading, setLoading] = useState(false)

  const location = useLocation()
  const { categories } = useCategoryContext()

  // 현재 경로에서 카테고리명 추출 (예: '/angry-guardian' → 'angry guardian')
  const currentPath = location.pathname.replace('/', '').replace(/-/g, ' ')
  const currentCategory = categories.find(
    (cat) => cat.en_name.toLowerCase() === currentPath
  )
  const categoryId = currentCategory?.id

  // 가디언 데이터를 불러오는 함수
  const loadMoreGadians = async (targetPage = 1, reset = false) => {
    if (loading || (!hasNext && !reset) || !categoryId) return
    setLoading(true)

    try {
      const data = await fetchGadiansPage(categoryId, targetPage)
      const gadianList = data.results || data

      const gadiansWithRewards = await Promise.all(
        gadianList.map(async (gadian: any) => {
          const items = await fetchGadianRewards(gadian.id)
          return { ...gadian, items }
        })
      )

      if (reset) {
        setGadians(gadiansWithRewards)
      } else {
        setGadians((prev) => [...prev, ...gadiansWithRewards])
      }

      setPage(targetPage + 1)
      setHasNext(!!data.next)
    } catch (err) {
      console.error('로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  // 카테고리 ID가 바뀌었을 때 초기화하고 1페이지부터 다시 로딩
  useEffect(() => {
    if (categoryId) {
      setGadians([])
      setPage(1)
      setHasNext(true)
      loadMoreGadians(1, true)
    }
  }, [categoryId])


  // 카테고리별 카드 렌더링
  const renderCardByCategory = (gadian: any) => {
    switch (categoryId) {
      case 1: // 가디언
        return <GadianCard key={gadian.id} {...gadian} />
      case 2: // 쿠르잔
        return <KurzanCard key={gadian.id} {...gadian} />
      case 3: // 필드보스
        return <FieldBossCard key={gadian.id} {...gadian} />
      case 4: // 던전
        return <DungeonCard key={gadian.id} {...gadian} />
      default:
        return <DungeonCard key={gadian.id} {...gadian} /> // 기본값
    }
  }



  return (
    <div className="flex flex-col items-center gap-6">
      {loading && gadians.length === 0 ? (
        <p>불러오는 중...</p>
      ) : (
        gadians.map((gadian) => renderCardByCategory(gadian))
      )}

      {hasNext && (
        <button
          onClick={() => loadMoreGadians(page)}
          disabled={loading}
          className="px-4 py-2 mt-4 bg-blue-600 text-black rounded"
        >
          {loading ? '불러오는 중...' : '더 보기'}
        </button>
      )}
    </div>
  )
}

export default Gadian
