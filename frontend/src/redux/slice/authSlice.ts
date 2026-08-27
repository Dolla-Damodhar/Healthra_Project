import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { meThunk } from '../service/authService'
import type { AuthUser } from '../service/authService'

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInStateUpdate(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    signOutStateUpdate(state) {
      state.user = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(meThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(meThunk.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(meThunk.rejected, (state) => {
        // A 401 here just means "not logged in yet" — not an error to surface.
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })
  },
})

export default authSlice.reducer
export const authActions = authSlice.actions
