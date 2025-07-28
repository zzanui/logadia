import { useState, useEffect } from 'react'
import { searchItemAverage, fetchItemSuggestions } from '@/api/api'

const ItemSearchPage = () => {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [suggestions, setSuggestions] = useState<string[]>([])

  // 자동완성용
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (keyword.trim()) {
        fetchItemSuggestions(keyword).then((data) => {
          const uniqueNames = [...new Set(data.map((item: any) => item))]
          setSuggestions(uniqueNames)
        })
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [keyword])

  // 검색 실행
  const handleSearch = async () => {
    try {
      const data = await searchItemAverage(keyword)
      setResults(data)
    } catch (err) {
      console.error('검색 실패:', err)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      {/* 검색 입력창 + 버튼 + 자동완성 */}
      <div className="relative w-full mb-6">
        <div className="flex">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border border-gray-300 rounded-l px-3 py-2 w-full"
            placeholder="아이템 이름을 입력하세요"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 whitespace-nowrap"
          >
            검색
          </button>
        </div>

        {/* 자동완성 드롭다운 */}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto text-black">
            {suggestions.map((name, idx) => (
              <li
                key={idx}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setKeyword(name)
                  setSuggestions([]) // 선택 시 드롭다운 닫기
                }}
              >
                {name}
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
                <td className="border border-gray-300 text-black px-4 py-2">{row.gadian.category.ko_name}</td>
                <td className="border border-gray-300 text-black px-4 py-2">{row.gadian.ko_name}</td>
                <td className="border border-gray-300 text-black px-4 py-2">{row.item.ko_name}</td>
                <td className="border border-gray-300 text-black px-4 py-2">{row.average_count}</td>
                <td className="border border-gray-300 text-black px-4 py-2">{row.binding ? 'O' : 'X'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ItemSearchPage
