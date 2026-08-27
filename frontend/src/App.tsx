import { useEffect } from 'react'
import { ColorModeProvider } from './context/ColorModeContext'
import { SnackbarProvider } from './components/snackbar'
import { AppRouter } from './routes/AppRouter'
import { useAppDispatch } from './utils/hooks'
import { meThunk } from './redux/service/authService'

const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(meThunk())
  }, [dispatch])

  return (
    <ColorModeProvider>
      <SnackbarProvider>
        <AppRouter />
      </SnackbarProvider>
    </ColorModeProvider>
  )
}

export default App
