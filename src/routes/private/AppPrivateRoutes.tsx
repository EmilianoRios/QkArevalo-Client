import { MainAdmin } from '@/pages'
import { RoutesWithNotFound } from '@/utils'
import { Route } from 'react-router-dom'

interface Props {
  isLoadingPrivate: boolean
}

function AppPrivateRoutes({ isLoadingPrivate }: Props) {
  return (
    <RoutesWithNotFound isLoadingPrivate={isLoadingPrivate}>
      {/* --- BLOG ROUTES --- */}
      <Route index element={<MainAdmin />} />
    </RoutesWithNotFound>
  )
}
export default AppPrivateRoutes
