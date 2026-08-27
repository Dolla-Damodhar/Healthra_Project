import { Box, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { colors } from '../theme'

type ActiveTabProps = {
  label: string
  path: string
}

export const ActiveTab = ({ label, path }: ActiveTabProps) => (
  <Box
    component={NavLink}
    to={path}
    sx={{
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0.6,
      '&.active .nav-label': {
        color: colors.primary.main,
        fontWeight: 700,
      },
      '&.active .nav-dot': {
        opacity: 1,
      },
    }}
  >
    <Typography
      className="nav-label"
      variant="body2"
      sx={{
        color: 'text.primary',
        fontWeight: 500,
        transition: 'color 0.2s ease',
      }}
    >
      {label}
    </Typography>
    <Box
      className="nav-dot"
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        backgroundColor: colors.primary.main,
        opacity: 0,
        transition: 'opacity 0.2s ease',
      }}
    />
  </Box>
)
