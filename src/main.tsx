import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeChakraui } from '@/config'
import { Provider } from 'react-redux'
import { store } from '@/redux'
import { AxiosInterceptor } from '@/services'

AxiosInterceptor()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={ThemeChakraui}>
        <ColorModeScript initialColorMode='dark' />
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
)
