import { Route, Routes } from 'react-router-dom'
import { LoadingPage, NotFound } from '@/components'

interface Props {
  children: JSX.Element[] | JSX.Element
  isLoadingPrivate: boolean
}

function RoutesWithNotFound({ children, isLoadingPrivate }: Props) {
  return (
    <Routes>
      {children}
      {isLoadingPrivate ? (
        <Route path='*' element={<LoadingPage />} />
      ) : (
        <Route path='*' element={<NotFound />} />
      )}
    </Routes>
  )
}
export default RoutesWithNotFound
