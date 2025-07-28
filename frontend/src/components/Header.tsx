import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCategoryContext } from '@/contexts/CategoryContext'

const Header: React.FC = () => {
  const location = useLocation()
  const { categories } = useCategoryContext()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(prev => !prev)
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">로가디아</span>
          </Link>

          {/* 햄버거 버튼 */}
          <div className="flex items-center lg:order-2">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">Open main menu</span>

              {/* 햄버거 아이콘 (열기) */}
              <svg
                className={`${menuOpen ? 'hidden' : 'block'} w-6 h-6`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>

              {/* X 아이콘 (닫기) */}
              <svg
                className={`${menuOpen ? 'block' : 'hidden'} w-6 h-6`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 네비게이션 메뉴 */}
          <div className={`${menuOpen ? 'block' : 'hidden'} lg:flex justify-between items-center w-full lg:w-auto lg:order-1`} id="mobile-menu-2">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {categories.map((category) => {
                const path = '/' + category.en_name.toLowerCase().replace(/\s+/g, '-')
                const isActive = location.pathname === path

                return (
                  <li key={category.id}>
                    <Link
                      to={path}
                      className={`block py-2 pr-4 pl-3 ${
                        isActive ? 'text-blue-700' : 'text-gray-700'
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700`}
                      onClick={() => setMenuOpen(false)} // 메뉴 클릭 시 자동 닫힘
                    >
                      {category.ko_name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
