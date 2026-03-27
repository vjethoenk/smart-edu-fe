import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: any;
  role: string | null;
}

const initialState: AuthState = {
  user: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
