import { PrivateRoutes, Roles } from '@/models'
import { LoadingPage } from '@/components'
import { RoutesWithNotFound } from '@/utils'
import { Route } from 'react-router-dom'
import { AuthGuard, RoleGuard } from '@/guard'
import { AppPrivateRoutes } from '@/routes'
import { Login } from '@/pages'

interface Props {
  isLoadingPrivate: boolean
}

function AppPublicRoutes({ isLoadingPrivate }: Props) {
  return (
    <RoutesWithNotFound isLoadingPrivate={isLoadingPrivate}>
      {/* --- PUBLIC ROUTES --- */}
      <Route index element={<Login />} />
      {/* --- PRIVATE ROUTES WITH AUTHGUARD AND ROLGUARD --- */}
      {!isLoadingPrivate ? (
        <Route element={<AuthGuard privateValidation={true} />}>
          <Route element={<RoleGuard role={Roles.ADMIN} />}>
            <Route
              path={`${PrivateRoutes.PRIVATE}/*`}
              element={<AppPrivateRoutes isLoadingPrivate={isLoadingPrivate} />}
            />
          </Route>
        </Route>
      ) : (
        <Route element={<LoadingPage />} />
      )}
    </RoutesWithNotFound>
  )
}
export default AppPublicRoutes
