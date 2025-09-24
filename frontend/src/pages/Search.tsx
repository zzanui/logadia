import { useState, useEffect, useRef } from 'react'
import { searchItemAverage, fetchItemSuggestions } from '@/api/api'

/** ===== 타입 정의 ===== */
type Suggestion = { ko_name: string; image: string | null }

type ResultRow = {
  content?: { ko_name?: string; category?: { ko_name?: string } }
  item?: { ko_name?: string }
  average_count?: number
  binding?: boolean
}

/** unknown → Suggestion[] 변환기 (안전 파싱) */
function toSuggestions(value: unknown): Suggestion[] {
  if (!Array.isArray(value)) return []
  return value.map((v) => {
    const obj = (v ?? {}) as Record<string, unknown>
    const ko_name =
      typeof obj.ko_name === 'string'
        ? obj.ko_name
        : typeof (obj as any).name === 'string'
        ? ((obj as any).name as string)
        : ''
    const image = typeof obj.image === 'string' ? obj.image : null
    return { ko_name, image }
  })
}

/** unknown → ResultRow[] 변환기 (안전 파싱) */
function toResultRows(value: unknown): ResultRow[] {
  if (!Array.isArray(value)) return []
  return value.map((v) => (v ?? {}) as ResultRow)
}

const ItemSearchPage = () => {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<ResultRow[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const autocompleteRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 외부 클릭 시 자동완성 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setSuggestions([])
        setSelectedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 자동완성 검색어 fetch (디바운스)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (keyword.trim()) {
        try {
          const data = (await fetchItemSuggestions(keyword)) as unknown
          const uniq = Array.from(
            new Map(toSuggestions(data).map((it) => [it.ko_name, it])).values()
          )
          setSuggestions(uniq)
          setSelectedIndex(-1)
        } catch (e) {
          console.error('자동완성 실패:', e)
        }
      } else {
        setSuggestions([])
      }
    }, 300)
    return () => clearTimeout(delayDebounce)
  }, [keyword])

  const handleFocus = async () => {
    if (keyword.trim() && suggestions.length === 0) {
      try {
        const data = (await fetchItemSuggestions(keyword)) as unknown
        const uniq = Array.from(
          new Map(toSuggestions(data).map((it) => [it.ko_name, it])).values()
        )
        setSuggestions(uniq)
      } catch (e) {
        console.error('자동완성 초기 로드 실패:', e)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const selected = suggestions[selectedIndex]
        setKeyword(selected.ko_name)
        setSuggestions([])
        handleSearch(selected.ko_name)
      } else {
        handleSearch(keyword)
      }
    }
  }

  const handleSearch = async (input?: string) => {
    try {
      const data = (await searchItemAverage(input ?? keyword)) as unknown
      setResults(toResultRows(data))
    } catch (err) {
      console.error('검색 실패:', err)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      {/* 검색창 */}
      <div className="relative w-full mb-6" ref={autocompleteRef}>
        <div className="flex">
          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 rounded-l px-3 py-2 w-full"
            placeholder="아이템 이름을 입력하세요"
          />
          <button
            onClick={() => handleSearch()}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 whitespace-nowrap"
          >
            검색
          </button>
        </div>

        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto text-black">
            {suggestions.map((item, idx) => (
              <li
                key={`${item.ko_name}-${idx}`}
                className={`flex items-center px-3 py-2 cursor-pointer ${
                  idx === selectedIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  setKeyword(item.ko_name)
                  setSuggestions([])
                  handleSearch(item.ko_name)
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.ko_name}
                    className="w-5 h-5 object-contain mr-2"
                  />
                )}
                <span>{item.ko_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 카테고리별 결과 테이블 */}
      {results.length > 0 && (() => {
        const groupedResults = results.reduce((acc, row) => {
          const categoryName = row.content?.category?.ko_name || '기타'
          if (!acc[categoryName]) acc[categoryName] = []
          acc[categoryName].push(row)
          return acc
        }, {} as Record<string, ResultRow[]>)

        return (
          <>
            {Object.entries(groupedResults).map(([categoryName, rows]) => (
              <div key={categoryName} className="mb-10">
                <h2 className="text-xl font-bold text-black mb-3">{categoryName}</h2>
                <table className="table-fixed w-full border">
                  <thead>
                    <tr className="bg-blue-50 text-gray-800">
                      <th className="w-1/4 border border-gray-400  text-left px-4 py-2">콘텐츠 이름</th>
                      <th className="w-1/4 border border-gray-400  text-left px-4 py-2">아이템 이름</th>
                      <th className="w-1/6 border border-gray-400  text-center px-4 py-2">예상 획득 갯수</th>
                      <th className="w-1/6 border border-gray-400  text-center px-4 py-2">귀속 여부</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row: ResultRow, idx: number) => (
                      <tr key={idx}>
                        <td className="w-1/4 border border-gray-400 text-gray-700 text-left px-4 py-2 whitespace-nowrap">
                          {row.content?.ko_name}
                        </td>
                        <td className="w-1/4 border border-gray-400 text-gray-700 text-left px-4 py-2 break-words">
                          {row.item?.ko_name}
                        </td>
                        <td className="w-1/6 border border-gray-400 text-gray-700 text-center px-4 py-2">
                          {row.average_count}
                        </td>
                        <td className="w-1/6 border border-gray-400 text-gray-700 text-center px-4 py-2">
                          {row.binding ? 'O' : 'X'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )
      })()}
    </div>
  )
}

export default ItemSearchPage
