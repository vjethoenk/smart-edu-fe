import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: any;
  role: string | null;
  isInitializing: boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  isInitializing: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isInitializing = false;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isInitializing = false;
    },
    setInitializing: (state, action) => {
      state.isInitializing = action.payload;
    },
  },
});

export const { setAuth, logout, setInitializing } = authSlice.actions;
export default authSlice.reducer;
