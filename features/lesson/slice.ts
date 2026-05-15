import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LessonState {
  currentLessonId: string | null;
  currentLessonType: string | null;
  currentLessonTitle: string | null;
}

const initialState: LessonState = {
  currentLessonId: null,
  currentLessonType: null,
  currentLessonTitle: null,
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    setCurrentLesson: (
      state,
      action: PayloadAction<{
        lessonId: string;
        itemType: string;
        title?: string;
      }>,
    ) => {
      state.currentLessonId = action.payload.lessonId;
      state.currentLessonType = action.payload.itemType;
      state.currentLessonTitle = action.payload.title ?? null;
    },
    clearCurrentLesson: (state) => {
      state.currentLessonId = null;
      state.currentLessonType = null;
      state.currentLessonTitle = null;
    },
  },
});

export const { setCurrentLesson, clearCurrentLesson } = lessonSlice.actions;
export default lessonSlice.reducer;
