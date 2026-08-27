import { Box, Container, Grid, IconButton, Stack, Typography } from '@mui/material'
import {
  ArrowForward as ArrowForwardIcon,
  CalendarMonth as CalendarMonthIcon,
  Videocam as VideocamIcon,
  Folder as FolderIcon,
  Medication as MedicationIcon,
  Science as ScienceIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material'
import { colors, glassSx } from '../../theme'
import { useColorMode } from '../../context/ColorModeContext'

const services = [
  {
    icon: CalendarMonthIcon,
    title: 'Book Appointment',
    description: 'Schedule appointments with top specialists in your area.',
    color: colors.primary.main,
    bg: 'rgba(76, 111, 245, 0.12)',
  },
  {
    icon: VideocamIcon,
    title: 'Online Consultation',
    description: 'Consult doctors online from the comfort of your home.',
    color: colors.secondary.main,
    bg: 'rgba(139, 92, 246, 0.12)',
  },
  {
    icon: FolderIcon,
    title: 'Medical History',
    description: 'Access your medical records and track your health.',
    color: colors.teal.main,
    bg: 'rgba(20, 184, 166, 0.12)',
  },
  {
    icon: MedicationIcon,
    title: 'Prescriptions',
    description: 'View, download and manage all your prescriptions.',
    color: colors.warning.main,
    bg: 'rgba(245, 158, 11, 0.12)',
  },
  {
    icon: ScienceIcon,
    title: 'Lab Reports',
    description: 'View and download your lab reports instantly.',
    color: colors.teal.main,
    bg: 'rgba(20, 184, 166, 0.12)',
  },
  {
    icon: NotificationsActiveIcon,
    title: 'Health Reminders',
    description: 'Get reminders for medicines, checkups and more.',
    color: colors.pink.main,
    bg: 'rgba(236, 72, 153, 0.12)',
  },
]

export const Services = () => {
  const { mode } = useColorMode()

  return (
    <Box sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="xl">
        <Stack alignItems="center" textAlign="center" spacing={1.5} sx={{ mb: 6 }}>
          <Typography
            variant="overline"
            sx={{ color: colors.primary.main, fontWeight: 700, letterSpacing: 1.5 }}
          >
            OUR SERVICES
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.9rem', md: '2.4rem' } }}>
            Healthcare Made Easy
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
            Everything you need to take care of your health, in one place.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid key={service.title} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Box
                sx={{
                  ...glassSx(mode),
                  height: '100%',
                  borderRadius: 4,
                  p: 3,
                  textAlign: 'center',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    background: service.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <service.icon sx={{ color: service.color, fontSize: 26 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
                  {service.description}
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    ...glassSx(mode),
                    '&:hover': { backgroundImage: colors.gradient.primary, color: '#fff' },
                  }}
                >
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
