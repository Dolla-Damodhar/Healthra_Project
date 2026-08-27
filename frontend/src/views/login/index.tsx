import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Favorite as FavoriteIcon } from '@mui/icons-material'
import { colors, glassSx } from '../../theme'
import { useColorMode } from '../../context/ColorModeContext'
import { useSnackbar } from '../../components/snackbar'
import { useAppDispatch } from '../../utils/hooks'
import { authActions } from '../../redux/slice/authSlice'
import { loginAction } from '../../redux/service/authService'

type LocationState = {
  from?: string
}

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
})

export const Login = () => {
  const { mode } = useColorMode()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { showSnackbar } = useSnackbar()
  const from = (location.state as LocationState | null)?.from ?? '/'

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const result = await loginAction(values)
      setSubmitting(false)

      if (!result.status) {
        showSnackbar(typeof result.error === 'string' ? result.error : 'Invalid email or password.', 'error')
        return
      }

      dispatch(authActions.signInStateUpdate(result.data!))
      showSnackbar(`Welcome back, ${result.data!.name || result.data!.email}!`, 'success')
      navigate(from, { replace: true })
    },
  })

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.light.blobB} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -140,
          left: -140,
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.light.blobA} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ ...glassSx(mode, true), borderRadius: 5, p: { xs: 3, md: 5 } }}>
          <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '16px',
                backgroundImage: colors.gradient.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FavoriteIcon sx={{ color: '#fff', fontSize: 26 }} />
            </Box>
            <Typography variant="h5" fontWeight={800}>
              Welcome
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              New here? Just enter an email and password to create your account.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={formik.isSubmitting}
                sx={{ py: 1.4 }}
              >
                Log In
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
