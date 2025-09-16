import { useCategoryContext } from '@/contexts/CategoryContext'
import type { RouteObject } from 'react-router-dom'

import Home from '@/pages/Home'
// import Page from '@/pages/page'
import Search from '@/pages/Search'
import Gadian from '@/pages/Gadian'
// import Kurzan from '@/pages/Kurzan'
// import FieldBoss from '@/pages/FieldBoss'
// import Dungeon from '@/pages/Dungeon'



export const useAppRoutes = (): RouteObject[] => {
  const { categories } = useCategoryContext()

  const staticRoutes: RouteObject[] = [
    { path: '/', element: <Search /> },
    { path: '/search', element: <Search /> },
    // { path: '/gadian', element: <Gadian /> },
    // { path: '/Kurzan-war', element: <Gadian /> },
    // { path: '/field_boss', element: <Gadian/>},
    // { path: '/dungeon', element: <Gadian/>}
  ]

  const dynamicRoutes = categories.map((category) => ({
    path: '/' + category.en_name.toLowerCase().replace(/\s+/g, '-'),
    // element: <div>{category.ko_name}</div>
    element: <Gadian />
    
  }))

  return [...staticRoutes, ...dynamicRoutes]
}