/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Alert, Slide, Snackbar, type AlertColor } from '@mui/material'
import type { TransitionProps } from '@mui/material/transitions'

type SnackbarState = {
  open: boolean
  message: string
  severity: AlertColor
}

type SnackbarContextType = {
  showSnackbar: (message: string, severity?: AlertColor) => void
}

const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => undefined,
})

export const useSnackbar = () => useContext(SnackbarContext)

const SlideTransition = (props: TransitionProps & { children: React.ReactElement }) => (
  <Slide {...props} direction="left" />
)

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  })

  const showSnackbar = useCallback((message: string, severity: AlertColor = 'success') => {
    setState({ open: true, message, severity })
  }, [])

  const handleClose = () => {
    setState((prev) => ({ ...prev, open: false }))
  }

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar])

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        slots={{ transition: SlideTransition }}
      >
        <Alert
          onClose={handleClose}
          severity={state.severity}
          variant="filled"
          sx={{ borderRadius: 3 }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
