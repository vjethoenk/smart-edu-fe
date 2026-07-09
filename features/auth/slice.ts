import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/types/api";

interface AuthState {
  user: IUser | null;
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
    setAuth: (
      state,
      action: PayloadAction<{
        user: IUser;
        role: string | null;
      }>,
    ) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isInitializing = false;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isInitializing = false;
    },
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.isInitializing = action.payload;
    },
  },
});

export const { setAuth, logout, setInitializing } = authSlice.actions;
export default authSlice.reducer;
