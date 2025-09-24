import { useEffect, useState, useRef } from 'react'
import FieldBossCard from '@/components/FieldBossCard'
import { fetchGadiansPage, fetchGadianRewards } from '@/api/api'


const FieldBoss = () => {
     const [gadians, setGadians] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(true)
  const [loading, setLoading] = useState(false)
  const didInitRef = useRef(false)

  const loadMoreGadians = async (targetPage?: number) => {
    if (loading || !hasNext) return
    setLoading(true)

    const nextPage = targetPage ?? page

    try {
      const data = await fetchGadiansPage(4, nextPage)//4는 필드보스
      const gadianList = data.results || data

      // 각 가디언에 대해 보상 정보 fetch
      const gadiansWithRewards = await Promise.all(
        gadianList.map(async (gadian: any) => {
          const items = await fetchGadianRewards(gadian.id)
          return { ...gadian, items }
        })
      )

      setGadians((prev) => [...prev, ...gadiansWithRewards])
      setPage(nextPage + 1)
      setHasNext(!!data.next)
    } catch (err) {
      console.error('로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!didInitRef.current) {
      loadMoreGadians(1)
      didInitRef.current = true
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-6">
      {gadians.map((gadian) => (
        <FieldBossCard key={gadian.id} {...gadian} />
      ))}

      {hasNext && (
        <button
          onClick={() => loadMoreGadians()}
          disabled={loading}
          className="px-4 py-2 mt-4 bg-blue-600 text-black rounded"
        >
          {loading ? '불러오는 중...' : '더 보기'}
        </button>
      )}
    </div>
  )
}
    export default FieldBoss