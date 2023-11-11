// theme.ts
// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
}

// 3. extend the theme
const themeChakra = extendTheme({
  config,
  fonts: {
    body: `'Inter', sans-serif`,
    heading: `'Inter', sans-serif`
  },
  colors: {
    gray: {
      800: '#181818'
    }
  }
})

export default themeChakra
