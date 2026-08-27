import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import { navItems, myBookingsNavItem } from './navItems'
import { colors } from '../theme'
import { useAppDispatch, useAppSelector } from '../utils/hooks'
import { authActions } from '../redux/slice/authSlice'
import { logoutAction } from '../redux/service/authService'

type SidebarContentProps = {
  onNavigate?: () => void
}

export const SidebarContent = ({ onNavigate }: SidebarContentProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated: authenticated, user } = useAppSelector((state) => state.auth)
  const visibleNavItems = authenticated ? [...navItems, myBookingsNavItem] : navItems

  const goTo = (path: string) => {
    navigate(path)
    onNavigate?.()
  }

  const handleLogout = async () => {
    await logoutAction()
    dispatch(authActions.signOutStateUpdate())
    goTo('/')
  }

  return (
    <Box sx={{ width: 260, p: 3, height: '100%' }}>
      <Typography
        variant="h6"
        sx={{
          backgroundImage: colors.gradient.text,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          mb: 3,
        }}
      >
        Healthra
      </Typography>
      <Stack spacing={2}>
        {visibleNavItems.map((item) => (
          <Box
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={onNavigate}
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 500,
              '&.active': { color: colors.primary.main, fontWeight: 700 },
            }}
          >
            {item.label}
          </Box>
        ))}
      </Stack>
      <Divider sx={{ my: 3 }} />
      <Stack spacing={1.5}>
        {authenticated ? (
          <>
            <Typography variant="body2" color="text.secondary">
              Hi, {user?.name}
            </Typography>
            <Button variant="outlined" fullWidth onClick={handleLogout}>
              Log Out
            </Button>
          </>
        ) : (
          <Button variant="contained" fullWidth onClick={() => goTo('/login')}>
            Log In
          </Button>
        )}
      </Stack>
    </Box>
  )
}
