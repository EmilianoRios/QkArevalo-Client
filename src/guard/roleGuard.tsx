import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { PrivateRoutes, Roles } from '@/models'
import { AppStore } from '../redux/store'

interface Props {
  role: Roles
}

function RoleGuard({ role }: Props) {
  const userState = useSelector((store: AppStore) => store.user)
  return userState.role === role ? (
    <Outlet />
  ) : (
    <Navigate to={PrivateRoutes.PRIVATE} />
  )
}

export default RoleGuard
