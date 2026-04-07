import { create } from "zustand";
import { EActiveView } from "./enum";

interface CourseState {
  activeView: EActiveView;
  setActiveView: (view: CourseState["activeView"]) => void;
  courseId: string | null;
  setCourseId: (id: string | null) => void;
}

export const useCourseStore = create<CourseState>()((set) => ({
  activeView: EActiveView.NONE,
  setActiveView: (activeView) => set({ activeView }),
  courseId: null,
  setCourseId: (courseId) => set({ courseId }),
}));
