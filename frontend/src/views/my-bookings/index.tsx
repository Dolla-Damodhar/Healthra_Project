import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Chip, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material'
import {
  CalendarMonth as CalendarMonthIcon,
  AccessTime as AccessTimeIcon,
  LocalHospital as LocalHospitalIcon,
  EventAvailable as EventAvailableIcon,
} from '@mui/icons-material'
import { colors, glassSx } from '../../theme'
import { useColorMode } from '../../context/ColorModeContext'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { getAppointmentsThunk } from '../../redux/service/appointmentService'
import { formatDate } from '../../utils/formatters'

export const MyBookings = () => {
  const { mode } = useColorMode()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { Get: bookings, isLoading } = useAppSelector((state) => state.appointments)

  useEffect(() => {
    dispatch(getAppointmentsThunk())
  }, [dispatch])

  return (
    <Box sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="md">
        <Stack alignItems="center" textAlign="center" spacing={1} sx={{ mb: 5 }}>
          <Typography
            variant="overline"
            sx={{ color: colors.primary.main, fontWeight: 700, letterSpacing: 1.5 }}
          >
            YOUR APPOINTMENTS
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.9rem', md: '2.4rem' } }}>
            My Bookings
          </Typography>
        </Stack>

        {isLoading ? (
          <Stack alignItems="center" sx={{ py: 8 }}>
            <CircularProgress />
          </Stack>
        ) : bookings.length === 0 ? (
          <Box sx={{ ...glassSx(mode, true), borderRadius: 5, p: { xs: 4, md: 6 }, textAlign: 'center' }}>
            <EventAvailableIcon sx={{ fontSize: 48, color: colors.primary.main, mb: 2 }} />
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              No appointments yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You haven't booked any appointments. Get started below.
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/book-appointment')}>
              Book an Appointment
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((booking) => (
              <Grid key={booking.id} size={{ xs: 12, sm: 6 }}>
                <Box sx={{ ...glassSx(mode, true), borderRadius: 4, p: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Chip
                      label={booking.department}
                      size="small"
                      sx={{ bgcolor: colors.primary.main, color: '#fff', fontWeight: 600 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Booked {formatDate(booking.created_at)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <LocalHospitalIcon sx={{ fontSize: 18, color: colors.secondary.main }} />
                    <Typography variant="subtitle1" fontWeight={700}>
                      {booking.doctor}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CalendarMonthIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(booking.date)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {booking.time_slot}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography variant="body2">
                    Patient: <strong>{booking.patient_name}</strong>
                  </Typography>
                  {booking.reason && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Reason: {booking.reason}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
