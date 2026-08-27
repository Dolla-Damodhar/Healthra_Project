import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import {
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
  Verified as VerifiedIcon,
  Favorite as FavoriteIcon,
  EventAvailable as EventAvailableIcon,
  Medication as MedicationIcon,
  Folder as FolderIcon,
  Groups as GroupsIcon,
  Shield as ShieldIcon,
  LocalHospital as LocalHospitalIcon,
  Star as StarIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import doctorImage from '../../assets/doctor image.png'
import { colors, glassSx } from '../../theme'
import { useColorMode } from '../../context/ColorModeContext'

const stats = [
  { icon: GroupsIcon, value: '20K+', label: 'Happy Patients' },
  { icon: ShieldIcon, value: '500+', label: 'Expert Doctors' },
  { icon: LocalHospitalIcon, value: '150+', label: 'Hospitals' },
  { icon: StarIcon, value: '4.8/5', label: 'Patient Rating' },
]

export const Hero = () => {
  const { mode } = useColorMode()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 6, md: 9 },
        pb: { xs: 8, md: 10 },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.light.blobB} 0%, transparent 70%)`,
          filter: 'blur(10px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -160,
          left: -160,
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.light.blobA} 0%, transparent 70%)`,
          filter: 'blur(10px)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Chip
              icon={<VerifiedIcon sx={{ color: `${colors.primary.main} !important` }} />}
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 22, height: 22, fontSize: 11 } }}>
                    <Avatar sx={{ bgcolor: colors.primary.main }}> </Avatar>
                    <Avatar sx={{ bgcolor: colors.secondary.main }}> </Avatar>
                    <Avatar sx={{ bgcolor: colors.pink.main }}> </Avatar>
                  </AvatarGroup>
                  <Typography variant="body2" fontWeight={600}>
                    Trusted by 10,000+ Patients
                  </Typography>
                </Stack>
              }
              sx={{
                ...glassSx(mode),
                py: 2.6,
                pl: 0.5,
                mb: 3,
                '& .MuiChip-label': { display: 'flex', alignItems: 'center' },
              }}
            />

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.4rem', md: '3.2rem' },
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Your Health,
              <br />
              <Box
                component="span"
                sx={{
                  backgroundImage: colors.gradient.text,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Our Priority
              </Box>
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 480, fontSize: '1.05rem' }}>
              Book appointments, consult doctors online, view medical history, and
              manage prescriptions — all in one secure place.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ py: 1.6, px: 3.5 }}
                onClick={() => navigate('/book-appointment')}
              >
                Book an Appointment
              </Button>
              <Button
                variant="outlined"
                size="large"
                endIcon={<PlayArrowIcon />}
                sx={{
                  py: 1.6,
                  px: 3.5,
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': { borderColor: colors.primary.main, background: 'transparent' },
                }}
              >
                Explore Services
              </Button>
            </Stack>

            <Box sx={{ ...glassSx(mode), borderRadius: 4, p: { xs: 2, md: 2.5 } }}>
              <Grid container>
                {stats.map((stat, index) => (
                  <Grid
                    key={stat.label}
                    size={{ xs: 6, sm: 3 }}
                    sx={{
                      textAlign: { xs: 'left', sm: 'left' },
                      borderRight: {
                        sm: index !== stats.length - 1 ? `1px solid ${mode === 'light' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.08)'}` : 'none',
                      },
                      px: 1.5,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <stat.icon sx={{ fontSize: 20, color: colors.primary.main }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: 420, md: 560 },
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background:
                    mode === 'light'
                      ? 'radial-gradient(circle, rgba(76,111,245,0.45) 0%, rgba(139,92,246,0.35) 45%, rgba(139,92,246,0) 72%)'
                      : 'radial-gradient(circle, rgba(76,111,245,0.5) 0%, rgba(139,92,246,0.4) 45%, rgba(139,92,246,0) 72%)',
                  filter: 'blur(6px)',
                  m: 'auto',
                  width: '115%',
                  height: '115%',
                }}
              />
              <Box
                component="img"
                src={doctorImage}
                alt="Doctor"
                sx={{
                  position: 'relative',
                  width: { xs: 260, md: 360 },
                  height: { xs: 400, md: 540 },
                  objectFit: 'contain',
                  objectPosition: 'bottom',
                }}
              />

              <Box
                sx={{
                  ...glassSx(mode, true),
                  position: 'absolute',
                  top: { xs: 10, md: 20 },
                  left: { xs: 0, md: -10 },
                  borderRadius: 3,
                  p: 1.6,
                  minWidth: 150,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <FavoriteIcon sx={{ fontSize: 16, color: colors.pink.main }} />
                  <Typography variant="caption" color="text.secondary">
                    Health Score
                  </Typography>
                </Stack>
                <Typography variant="h6" fontWeight={800}>
                  82%
                </Typography>
                <Typography variant="caption" sx={{ color: colors.success.main, fontWeight: 600 }}>
                  Good
                </Typography>
              </Box>

              <Box
                sx={{
                  ...glassSx(mode, true),
                  position: 'absolute',
                  top: { xs: 40, md: 60 },
                  right: { xs: 0, md: -20 },
                  borderRadius: 3,
                  p: 1.8,
                  minWidth: 200,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <EventAvailableIcon sx={{ fontSize: 16, color: colors.primary.main }} />
                  <Typography variant="caption" color="text.secondary">
                    Next Appointment
                  </Typography>
                </Stack>
                <Typography variant="body2" fontWeight={700}>
                  Dr. Sarah Wilson
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Cardiologist
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  May 20, 2026 at 10:30 AM
                </Typography>
                <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />} sx={{ p: 0, minWidth: 0 }}>
                  View Details
                </Button>
              </Box>

              <Box
                sx={{
                  ...glassSx(mode, true),
                  position: 'absolute',
                  bottom: { xs: 90, md: 130 },
                  right: { xs: -10, md: -30 },
                  borderRadius: 3,
                  p: 1.6,
                  minWidth: 150,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <MedicationIcon sx={{ fontSize: 16, color: colors.secondary.main }} />
                  <Typography variant="caption" color="text.secondary">
                    Prescription
                  </Typography>
                </Stack>
                <Typography variant="body2" fontWeight={700}>
                  2 New
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tap to view
                </Typography>
              </Box>

              <Box
                sx={{
                  ...glassSx(mode, true),
                  position: 'absolute',
                  bottom: { xs: 0, md: 10 },
                  left: { xs: 0, md: 10 },
                  borderRadius: 3,
                  p: 1.6,
                  minWidth: 170,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <FolderIcon sx={{ fontSize: 16, color: colors.teal.main }} />
                  <Typography variant="caption" color="text.secondary">
                    Medical History
                  </Typography>
                </Stack>
                <Typography variant="body2" fontWeight={700}>
                  12 Records
                </Typography>
                <Button size="small" sx={{ p: 0, minWidth: 0 }}>
                  View all
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
