import { useState, useEffect, useRef } from 'react'
import { searchItemAverage, fetchItemSuggestions } from '@/api/api'

const ItemSearchPage = () => {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<{ ko_name: string; image: string | null }[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1) // 🔼 선택된 인덱스
  const autocompleteRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 외부 클릭 감지 → 드롭다운 닫기
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

  // 자동완성 fetch
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (keyword.trim()) {
        fetchItemSuggestions(keyword).then((data) => {
          const unique = Array.from(new Map(data.map((item: any) => [item.ko_name, item])).values())
          setSuggestions(unique)
          setSelectedIndex(-1)
        })
      } else {
        setSuggestions([])
      }
    }, 300)
    return () => clearTimeout(delayDebounce)
  }, [keyword])

  // input 다시 클릭 시 드롭다운 복원
  const handleFocus = async () => {
    if (keyword.trim() && suggestions.length === 0) {
      const data = await fetchItemSuggestions(keyword)
      const unique = Array.from(new Map(data.map((item: any) => [item.ko_name, item])).values())
      setSuggestions(unique)
    }
  }

  // 키보드 ↑↓ 엔터 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  // 검색 실행
  const handleSearch = async (input?: string) => {
    try {
      const data = await searchItemAverage(input ?? keyword)
      setResults(data)
    } catch (err) {
      console.error('검색 실패:', err)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      {/* 검색 입력창 + 버튼 + 자동완성 */}
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
                key={idx}
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

      {/* 검색 결과 테이블 */}
      {results.length > 0 && (
        <table className="table-auto w-full border mt-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 text-black px-4 py-2">카테고리</th>
              <th className="border border-gray-300 text-black px-4 py-2">콘텐츠 이름</th>
              <th className="border border-gray-300 text-black px-4 py-2">아이템 이름</th>
              <th className="border border-gray-300 text-black px-4 py-2">개수</th>
              <th className="border border-gray-300 text-black px-4 py-2">귀속 여부</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 text-black px-4 py-2">
                  {row.gadian?.category?.ko_name}
                </td>
                <td className="border border-gray-300 text-black px-4 py-2">
                  {row.gadian?.ko_name}
                </td>
                <td className="border border-gray-300 text-black px-4 py-2">
                  {row.item?.ko_name}
                </td>
                <td className="border border-gray-300 text-black px-4 py-2">
                  {row.average_count}
                </td>
                <td className="border border-gray-300 text-black px-4 py-2">
                  {row.binding ? 'O' : 'X'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ItemSearchPage
