import { useAppRoutes } from '@/routes/routes'
import { useRoutes } from 'react-router-dom'

const AppRouter = () => {
  const routes = useAppRoutes()
  return useRoutes(routes)
}

export default AppRouter
