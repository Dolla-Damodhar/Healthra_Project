import { createTheme, type PaletteMode, type Theme } from '@mui/material'
import { alpha } from '@mui/material/styles'

export const colors = {
  primary: {
    main: '#4C6FF5',
    light: '#7C93F9',
    dark: '#3B4FD9',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#8B5CF6',
    light: '#A78BFA',
    dark: '#6D28D9',
    contrastText: '#FFFFFF',
  },
  gradient: {
    primary: 'linear-gradient(135deg, #4C6FF5 0%, #8B5CF6 100%)',
    primaryHover: 'linear-gradient(135deg, #3B4FD9 0%, #7C3AED 100%)',
    text: 'linear-gradient(135deg, #4C6FF5 0%, #8B5CF6 100%)',
    banner: 'linear-gradient(120deg, #4C6FF5 0%, #7B5CF7 50%, #9B5CF6 100%)',
  },
  success: {
    main: '#22C55E',
    light: '#86EFAC',
  },
  warning: {
    main: '#F59E0B',
  },
  error: {
    main: '#EF4444',
    light: '#FCA5A5',
  },
  info: {
    main: '#3B82F6',
  },
  pink: {
    main: '#EC4899',
    light: '#FBCFE8',
  },
  teal: {
    main: '#14B8A6',
    light: '#99F6E4',
  },
  light: {
    background: '#F5F7FE',
    paper: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.65)',
    glassBorder: 'rgba(255, 255, 255, 0.6)',
    glassStrong: 'rgba(255, 255, 255, 0.85)',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    divider: 'rgba(15, 23, 42, 0.08)',
    blobA: 'rgba(76, 111, 245, 0.18)',
    blobB: 'rgba(139, 92, 246, 0.18)',
  },
  dark: {
    background: '#0B0E1A',
    paper: '#141826',
    glass: 'rgba(30, 34, 54, 0.6)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    glassStrong: 'rgba(30, 34, 54, 0.85)',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    divider: 'rgba(255, 255, 255, 0.08)',
    blobA: 'rgba(76, 111, 245, 0.25)',
    blobB: 'rgba(139, 92, 246, 0.25)',
  },
}

export const getTheme = (mode: PaletteMode): Theme => {
  const modeColors = mode === 'light' ? colors.light : colors.dark

  return createTheme({
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      info: colors.info,
      background: {
        default: modeColors.background,
        paper: modeColors.paper,
      },
      text: {
        primary: modeColors.textPrimary,
        secondary: modeColors.textSecondary,
      },
      divider: modeColors.divider,
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 800 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: modeColors.background,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingLeft: 22,
            paddingRight: 22,
            paddingTop: 10,
            paddingBottom: 10,
          },
          containedPrimary: {
            backgroundImage: colors.gradient.primary,
            boxShadow: `0 8px 24px ${alpha(colors.primary.main, 0.35)}`,
            '&:hover': {
              backgroundImage: colors.gradient.primaryHover,
              boxShadow: `0 10px 28px ${alpha(colors.primary.main, 0.45)}`,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
          },
        },
      },
    },
  })
}

export const glassSx = (mode: PaletteMode, strong = false) => {
  const modeColors = mode === 'light' ? colors.light : colors.dark

  return {
    background: strong ? modeColors.glassStrong : modeColors.glass,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${modeColors.glassBorder}`,
    boxShadow:
      mode === 'light'
        ? '0 8px 32px rgba(76, 111, 245, 0.12)'
        : '0 8px 32px rgba(0, 0, 0, 0.35)',
  }
}
