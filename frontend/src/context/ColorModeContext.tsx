/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CssBaseline, ThemeProvider, type PaletteMode } from '@mui/material'
import { getTheme } from '../theme'

type ColorModeContextType = {
  mode: PaletteMode
  toggleColorMode: () => void
}

const STORAGE_KEY = 'easybuilder-color-mode'

const ColorModeContext = createContext<ColorModeContextType>({
  mode: 'light',
  toggleColorMode: () => undefined,
})

export const useColorMode = () => useContext(ColorModeContext)

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const storedMode = window.localStorage.getItem(STORAGE_KEY)

    return storedMode === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const toggleColorMode = () => {
    setMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'))
  }

  const theme = useMemo(() => getTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
