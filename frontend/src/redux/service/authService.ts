/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { HealthraApi } from './commonAxios'

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  email: string
  name: string
}

const getErrorMessage = (error: any) =>
  error?.response?.data?.detail ||
  error?.response?.data?.message ||
  error?.message ||
  'Something went wrong'

export const loginAction = async (payload: LoginPayload) => {
  try {
    const response = await HealthraApi.post('auth/login/', payload)

    if (response.status === 200) {
      return { status: true, data: response.data as AuthUser }
    }

    return { status: false, error: response.data }
  } catch (error: any) {
    return { status: false, error: getErrorMessage(error) }
  }
}

export const logoutAction = async () => {
  try {
    await HealthraApi.post('auth/logout/')
    return { status: true }
  } catch (error: any) {
    return { status: false, error: getErrorMessage(error) }
  }
}

// Hydrates auth state on app load (httpOnly cookies can't be read by JS,
// so this is the only way to know "am I already logged in"), and also
// primes the csrftoken cookie for any subsequent POST/PUT/PATCH/DELETE.
export const meThunk = createAsyncThunk<AuthUser>(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HealthraApi.get('auth/me/')
      return response.data as AuthUser
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)
