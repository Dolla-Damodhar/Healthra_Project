import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material'
import { navItems, myBookingsNavItem, ActiveTab, SidebarContent } from '../navigations'
import { colors, glassSx } from '../theme'
import { useColorMode } from '../context/ColorModeContext'
import { getPageMeta } from './getPageMeta'
import { useAppDispatch, useAppSelector } from '../utils/hooks'
import { authActions } from '../redux/slice/authSlice'
import { logoutAction } from '../redux/service/authService'

export const UserLayout = () => {
  const theme = useTheme()
  const { mode } = useColorMode()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated: authenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const meta = getPageMeta(location.pathname)
    document.title = meta.title
  }, [location.pathname])

  const handleLogout = async () => {
    await logoutAction()
    dispatch(authActions.signOutStateUpdate())
    navigate('/')
  }

  const visibleNavItems = authenticated ? [...navItems, myBookingsNavItem] : navItems

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          ...glassSx(mode, true),
          color: 'text.primary',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1.5, justifyContent: 'space-between' }}>
            <Stack direction="row" alignItems="center" spacing={1.2}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '14px',
                  backgroundImage: colors.gradient.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FavoriteIcon sx={{ color: '#fff', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 800 }}>
                  Healthra
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Care that connects.
                </Typography>
              </Box>
            </Stack>

            {!isMobile && (
              <Stack direction="row" spacing={3}>
                {visibleNavItems.map((item) => (
                  <ActiveTab key={item.path} label={item.label} path={item.path} />
                ))}
              </Stack>
            )}

            <Stack direction="row" alignItems="center" spacing={1.5}>
              {!isMobile && (
                <IconButton
                  sx={{
                    ...glassSx(mode),
                    width: 42,
                    height: 42,
                  }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              )}
              {!isMobile ? (
                authenticated ? (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Hi, {user?.name}
                    </Typography>
                    <Button variant="outlined" onClick={handleLogout}>
                      Log Out
                    </Button>
                  </>
                ) : (
                  <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
                    Log In
                  </Button>
                )
              ) : (
                <IconButton onClick={() => setDrawerOpen(true)}>
                  <MenuIcon />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <SidebarContent onNavigate={() => setDrawerOpen(false)} />
      </Drawer>

      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Healthra. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}
