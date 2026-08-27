import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { EventAvailable as EventAvailableIcon } from '@mui/icons-material'
import { colors, glassSx } from '../../theme'
import { useColorMode } from '../../context/ColorModeContext'
import { useSnackbar } from '../../components/snackbar'
import { useAppSelector } from '../../utils/hooks'
import { createAppointmentAction } from '../../redux/service/appointmentService'
import { departments, doctorsByDepartment, timeSlots } from './data'

const today = new Date().toISOString().split('T')[0]

const validationSchema = Yup.object({
  department: Yup.string().required('Please select a department'),
  doctor: Yup.string().required('Please select a doctor'),
  date: Yup.string().required('Please pick a date'),
  timeSlot: Yup.string().required('Please pick a time slot'),
  patientName: Yup.string().trim().required('Patient name is required'),
  patientPhone: Yup.string()
    .matches(/^[0-9+\-\s]{7,15}$/, 'Enter a valid phone number')
    .required('Phone number is required'),
  patientEmail: Yup.string().email('Enter a valid email').required('Email is required'),
  reason: Yup.string(),
})

export const BookAppointment = () => {
  const { mode } = useColorMode()
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()
  const user = useAppSelector((state) => state.auth.user)

  const formik = useFormik({
    initialValues: {
      department: '',
      doctor: '',
      date: '',
      timeSlot: '',
      patientName: user?.name ?? '',
      patientPhone: '',
      patientEmail: user?.email ?? '',
      reason: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const result = await createAppointmentAction({
        department: values.department,
        doctor: values.doctor,
        date: values.date,
        time_slot: values.timeSlot,
        patient_name: values.patientName,
        patient_phone: values.patientPhone,
        patient_email: values.patientEmail,
        reason: values.reason,
      })
      setSubmitting(false)

      if (!result.status) {
        showSnackbar(typeof result.error === 'string' ? result.error : 'Failed to book appointment.', 'error')
        return
      }

      showSnackbar('Appointment booked successfully!', 'success')
      resetForm()
      navigate('/my-bookings')
    },
  })

  const doctorOptions = formik.values.department ? doctorsByDepartment[formik.values.department] ?? [] : []

  return (
    <Box sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="md">
        <Stack alignItems="center" textAlign="center" spacing={1} sx={{ mb: 5 }}>
          <Typography
            variant="overline"
            sx={{ color: colors.primary.main, fontWeight: 700, letterSpacing: 1.5 }}
          >
            BOOK APPOINTMENT
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.9rem', md: '2.4rem' } }}>
            Schedule Your Visit
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
            Pick a department, doctor and a time that works for you.
          </Typography>
        </Stack>

        <Box sx={{ ...glassSx(mode, true), borderRadius: 5, p: { xs: 3, md: 5 } }}>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  name="department"
                  label="Department"
                  value={formik.values.department}
                  onChange={(event) => {
                    formik.setFieldValue('department', event.target.value)
                    formik.setFieldValue('doctor', '')
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.department && Boolean(formik.errors.department)}
                  helperText={formik.touched.department && formik.errors.department}
                >
                  {departments.map((department) => (
                    <MenuItem key={department} value={department}>
                      {department}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  name="doctor"
                  label="Doctor"
                  value={formik.values.doctor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.department}
                  error={formik.touched.doctor && Boolean(formik.errors.doctor)}
                  helperText={formik.touched.doctor && formik.errors.doctor}
                >
                  {doctorOptions.map((doctor) => (
                    <MenuItem key={doctor} value={doctor}>
                      {doctor}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="date"
                  label="Date"
                  type="date"
                  slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: today } }}
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  name="timeSlot"
                  label="Time Slot"
                  value={formik.values.timeSlot}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.timeSlot && Boolean(formik.errors.timeSlot)}
                  helperText={formik.touched.timeSlot && formik.errors.timeSlot}
                >
                  {timeSlots.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={12}>
                <Box sx={{ borderTop: `1px solid ${mode === 'light' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.08)'}`, pt: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                    Patient Details
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="patientName"
                  label="Full Name"
                  value={formik.values.patientName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.patientName && Boolean(formik.errors.patientName)}
                  helperText={formik.touched.patientName && formik.errors.patientName}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="patientPhone"
                  label="Phone Number"
                  value={formik.values.patientPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.patientPhone && Boolean(formik.errors.patientPhone)}
                  helperText={formik.touched.patientPhone && formik.errors.patientPhone}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="patientEmail"
                  label="Email"
                  type="email"
                  value={formik.values.patientEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.patientEmail && Boolean(formik.errors.patientEmail)}
                  helperText={formik.touched.patientEmail && formik.errors.patientEmail}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  name="reason"
                  label="Reason for Visit (optional)"
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid size={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={formik.isSubmitting}
                  endIcon={<EventAvailableIcon />}
                  sx={{ py: 1.6 }}
                >
                  Confirm Appointment
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
