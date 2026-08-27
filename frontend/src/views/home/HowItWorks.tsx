import { Box, Container, Grid, Stack, Typography } from '@mui/material'
import {
  FileDownload as FileDownloadIcon,
  Apple as AppleIcon,
  Shop as ShopIcon,
  Favorite as FavoriteIcon,
  DirectionsRun as DirectionsRunIcon,
  Bedtime as BedtimeIcon,
} from '@mui/icons-material'
import phoneImage from '../../assets/phone image.png'
import { colors, glassSx } from '../../theme'
import { useColorMode } from '../../context/ColorModeContext'

const steps = [
  {
    number: '01',
    title: 'Create Account',
    description: 'Sign up and create your profile in just a few minutes.',
  },
  {
    number: '02',
    title: 'Book or Consult',
    description: 'Choose a doctor and book an appointment or consult online.',
  },
  {
    number: '03',
    title: 'Visit & Get Care',
    description: 'Visit the hospital or connect online and get the care you need.',
  },
  {
    number: '04',
    title: 'Track & Manage',
    description: 'Track your health, view history and manage prescriptions.',
  },
]

export const HowItWorks = () => {
  const { mode } = useColorMode()

  return (
    <Box sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              variant="overline"
              sx={{ color: colors.primary.main, fontWeight: 700, letterSpacing: 1.5 }}
            >
              HOW IT WORKS
            </Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.9rem', md: '2.2rem' }, mb: 4 }}>
              Simple Steps for
              <br />
              Better Health
            </Typography>

            <Stack spacing={3}>
              {steps.map((step, index) => (
                <Stack direction="row" spacing={2.5} key={step.number}>
                  <Stack alignItems="center" spacing={0}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        ...glassSx(mode),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.primary.main,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {step.number}
                    </Box>
                    {index !== steps.length - 1 && (
                      <Box
                        sx={{
                          width: '1px',
                          flexGrow: 1,
                          minHeight: 24,
                          background: mode === 'light' ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.12)',
                        }}
                      />
                    )}
                  </Stack>
                  <Box sx={{ pb: index !== steps.length - 1 ? 1 : 0 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                background: mode === 'light' ? '#FFFFFF' : colors.dark.paper,
                border: `1px solid ${mode === 'light' ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow:
                  mode === 'light'
                    ? '0 24px 60px rgba(76, 111, 245, 0.14)'
                    : '0 24px 60px rgba(0, 0, 0, 0.4)',
                borderRadius: 6,
                p: { xs: 3, md: 5 },
                position: 'relative',
                overflow: 'visible',
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      ...glassSx(mode),
                      display: 'inline-flex',
                      borderRadius: 999,
                      px: 2,
                      py: 0.7,
                      mb: 2.5,
                    }}
                  >
                    <FileDownloadIcon sx={{ fontSize: 16, color: colors.primary.main }} />
                    <Typography variant="caption" fontWeight={600}>
                      Download Our App
                    </Typography>
                  </Stack>
                  <Typography variant="h4" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mb: 2 }}>
                    Healthcare at Your Fingertips
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Access appointments, prescriptions, reports and more —
                    anytime, anywhere.
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{
                        bgcolor: mode === 'light' ? '#0F172A' : '#000',
                        color: '#fff',
                        borderRadius: 2.5,
                        px: 2,
                        py: 1,
                        cursor: 'pointer',
                      }}
                    >
                      <AppleIcon fontSize="small" />
                      <Box>
                        <Typography variant="caption" display="block" sx={{ opacity: 0.7, lineHeight: 1 }}>
                          Download on the
                        </Typography>
                        <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
                          App Store
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{
                        bgcolor: mode === 'light' ? '#0F172A' : '#000',
                        color: '#fff',
                        borderRadius: 2.5,
                        px: 2,
                        py: 1,
                        cursor: 'pointer',
                      }}
                    >
                      <ShopIcon fontSize="small" />
                      <Box>
                        <Typography variant="caption" display="block" sx={{ opacity: 0.7, lineHeight: 1 }}>
                          GET IT ON
                        </Typography>
                        <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
                          Google Play
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: { xs: 260, md: 320 },
                      mx: 'auto',
                      maxWidth: 260,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '90%',
                        height: '90%',
                        borderRadius: '50%',
                        background:
                          mode === 'light'
                            ? 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(76,111,245,0.14) 45%, transparent 72%)'
                            : 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(76,111,245,0.2) 45%, transparent 72%)',
                        filter: 'blur(4px)',
                      }}
                    />

                    <Box
                      component="img"
                      src={phoneImage}
                      alt="Healthra mobile app"
                      sx={{ position: 'relative', width: { xs: 170, md: 200 }, height: 'auto' }}
                    />

                    <Box
                      sx={{
                        ...glassSx(mode, true),
                        position: 'absolute',
                        top: 4,
                        left: { xs: 4, md: -8 },
                        borderRadius: 3,
                        p: 1.3,
                        minWidth: 120,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FavoriteIcon sx={{ fontSize: 14, color: colors.pink.main }} />
                        <Typography variant="caption" color="text.secondary">
                          Heart rate
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2" fontWeight={800}>
                        72 bpm
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        ...glassSx(mode, true),
                        position: 'absolute',
                        top: '38%',
                        right: { xs: -4, md: -16 },
                        borderRadius: 3,
                        p: 1.3,
                        minWidth: 110,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DirectionsRunIcon sx={{ fontSize: 14, color: colors.primary.main }} />
                        <Typography variant="caption" color="text.secondary">
                          Steps
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2" fontWeight={800}>
                        6,240
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        ...glassSx(mode, true),
                        position: 'absolute',
                        bottom: 8,
                        left: { xs: 0, md: -8 },
                        borderRadius: 3,
                        p: 1.3,
                        minWidth: 100,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <BedtimeIcon sx={{ fontSize: 14, color: colors.secondary.main }} />
                        <Typography variant="caption" color="text.secondary">
                          Sleep
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2" fontWeight={800}>
                        7.5 hrs
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
