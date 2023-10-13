import { LoadingPage } from '@/components'
import { resetUser, updateUser } from '@/redux'
import { authenticateUserService } from '@/services'
import { Suspense, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { AppPublicRoutes } from '@/routes'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()

  function updateColorMode() {
    const colorMode = localStorage.getItem('chakra-ui-color-mode')
    if (colorMode === 'light') {
      localStorage.removeItem('chakra-ui-color-mode')
      localStorage.setItem('chakra-ui-color-mode', 'dark')
    }
  }

  async function authenticateUser() {
    try {
      const res = await authenticateUserService()
      dispatch(updateUser(res))
      setIsLoading(false)
    } catch (error) {
      dispatch(resetUser())
      setIsLoading(false)
    }
  }

  useEffect(() => {
    updateColorMode()
    authenticateUser()
  })

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <AppPublicRoutes isLoadingPrivate={isLoading} />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
