import { useCategoryContext } from '@/contexts/CategoryContext'
import type { RouteObject } from 'react-router-dom'

import Home from '@/pages/Home'
import Gadian from '@/pages/Gadian'
import Search from '@/pages/Search'


export const useAppRoutes = (): RouteObject[] => {
  const { categories } = useCategoryContext()

  const staticRoutes: RouteObject[] = [
    { path: '/', element: <Home /> },
    {path: '/search', element: <Search /> },
  ]

  const dynamicRoutes = categories.map((category) => ({
    path: '/' + category.en_name.toLowerCase().replace(/\s+/g, '-'),
    // element: <div>{category.ko_name}</div>
    element: <Gadian/>
  }))

  return [...staticRoutes, ...dynamicRoutes]
}