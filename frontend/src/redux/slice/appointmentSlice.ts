import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getAppointmentsThunk } from '../service/appointmentService'
import type { Appointment } from '../service/appointmentService'

export interface AppointmentState {
  Get: Appointment[]
  isLoading: boolean
  error: string | null
}

const initialState: AppointmentState = {
  Get: [],
  isLoading: false,
  error: null,
}

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAppointmentsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAppointmentsThunk.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.isLoading = false
        state.Get = action.payload
      })
      .addCase(getAppointmentsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) ?? 'Failed to load appointments'
      })
  },
})

export default appointmentSlice.reducer
