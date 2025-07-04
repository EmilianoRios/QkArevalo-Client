import { ListOfUsers, Main, Register } from '@/pages'
import { RoutesWithNotFound } from '@/utils'
import { Route } from 'react-router-dom'

interface Props {
  isLoadingPrivate: boolean
}

function AppPrivateRoutes({ isLoadingPrivate }: Props) {
  return (
    <RoutesWithNotFound isLoadingPrivate={isLoadingPrivate}>
      {/* --- BLOG ROUTES --- */}
      <Route index element={<Main />} />
      <Route path={`/register`} element={<Register />} />
      <Route path={`/users`} element={<ListOfUsers />} />
    </RoutesWithNotFound>
  )
}
export default AppPrivateRoutes
