import { LoadingPage } from '@/components'
import { AuthGuard, RoleGuard } from '@/guard'
import { PrivateRoutes, Roles } from '@/models'
import { DowloadPDF, Login, Main } from '@/pages'
import { AppPrivateRoutes } from '@/routes'
import { RoutesWithNotFound } from '@/utils'
import { Route } from 'react-router-dom'

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
          <Route path={`/${PrivateRoutes.ME}`} element={<Main />} />
          <Route path={`/${PrivateRoutes.DOWNLOAD}`} element={<DowloadPDF />} />
        </Route>
      ) : (
        <Route element={<LoadingPage />} />
      )}
    </RoutesWithNotFound>
  )
}
export default AppPublicRoutes
