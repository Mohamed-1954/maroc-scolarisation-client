import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type User } from '@/types/user';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean; // Has Firebase onAuthStateChanged fired at least once?
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAuthInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called by onAuthStateChanged listener
    setAuthState: (state, action: PayloadAction<{ user: User | null }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.user; // True if user profile exists
      state.isAuthInitialized = true; // Mark as initialized once this runs
    },
    // Separate action in case listener fires with null user initially
    setAuthInitialized: (state, action: PayloadAction<boolean>) => {
      state.isAuthInitialized = action.payload;
      // If initializing to true and no user is set, ensure isAuthenticated is false
      if (action.payload && !state.user) {
        state.isAuthenticated = false;
      }
    },
    // Clear user data on logout trigger (optional, setAuthState handles null)
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Keep isAuthInitialized as true
    },
  },
});

export const { setAuthState, setAuthInitialized, clearUser } = authSlice.actions;
export default authSlice.reducer;