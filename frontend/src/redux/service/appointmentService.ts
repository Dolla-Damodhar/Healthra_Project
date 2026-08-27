import { createAsyncThunk } from '@reduxjs/toolkit'
import { HealthraApi } from './commonAxios'

export interface Appointment {
  id: number
  department: string
  doctor: string
  date: string
  time_slot: string
  patient_name: string
  patient_phone: string
  patient_email: string
  reason: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
}

export type CreateAppointmentPayload = Pick<
  Appointment,
  'department' | 'doctor' | 'date' | 'time_slot' | 'patient_name' | 'patient_phone' | 'patient_email' | 'reason'
>

const getErrorMessage = (error: any) =>
  error?.response?.data?.time_slot?.[0] ||
  error?.response?.data?.detail ||
  error?.response?.data?.message ||
  error?.message ||
  'Something went wrong'

// Server auto-scopes this to the logged-in customer (via the auth cookie) —
// no patient_email filter needed on the client side.
export const getAppointmentsThunk = createAsyncThunk<Appointment[]>(
  'appointments/list',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HealthraApi.get('appointments/')
      return response.data.results as Appointment[]
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const createAppointmentAction = async (payload: CreateAppointmentPayload) => {
  try {
    const response = await HealthraApi.post('appointments/', payload)

    if (response.status === 201) {
      return { status: true, data: response.data as Appointment }
    }

    return { status: false, error: response.data }
  } catch (error: any) {
    return { status: false, error: getErrorMessage(error) }
  }
}
