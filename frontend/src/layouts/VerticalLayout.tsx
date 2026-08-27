import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Drawer, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { navItems } from '../navigations'
import { NavLink } from 'react-router-dom'
import { colors, glassSx } from '../theme'
import { useColorMode } from '../context/ColorModeContext'

const drawerWidth = 260

export const VerticalLayout = () => {
  const { mode } = useColorMode()
  const [open, setOpen] = useState(true)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            ...glassSx(mode, true),
            border: 'none',
          },
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          <Typography
            variant="h6"
            sx={{
              backgroundImage: colors.gradient.text,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Healthra
          </Typography>
        </Toolbar>
        <Stack spacing={0.5} sx={{ px: 2 }}>
          {navItems.map((item) => (
            <Box
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                px: 2,
                py: 1.2,
                borderRadius: 2,
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: 500,
                '&.active': {
                  backgroundImage: colors.gradient.primary,
                  color: '#fff',
                },
              }}
            >
              {item.label}
            </Box>
          ))}
        </Stack>
      </Drawer>

      <Box sx={{ flex: 1 }}>
        <Toolbar sx={{ px: 2 }}>
          <IconButton onClick={() => setOpen((prev) => !prev)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Box sx={{ px: 3, pb: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
