import { PrivateRoutes } from '@/models'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { AppStore } from '../redux/store'

interface Props {
  privateValidation: boolean
}

const PrivateValidationRoutes = <Outlet />
const PublicValidationRoutes = (
  <Navigate replace to={`/${PrivateRoutes.PRIVATE}`} />
)
const LoginRoute = <Navigate replace to={'/'} />

function AuthGuard({ privateValidation }: Props) {
  const userState = useSelector((store: AppStore) => store.user)
  if (privateValidation) {
    if (!userState.username) return LoginRoute
    return PrivateValidationRoutes
  }
  return PublicValidationRoutes
}
export default AuthGuard
