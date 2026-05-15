import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slice";
import lessonReducer from "@/features/lesson/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lesson: lessonReducer,
  },
});
