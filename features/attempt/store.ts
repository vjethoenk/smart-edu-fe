import { create } from "zustand";

interface AttemptState {
  attemptId: string | null;
  setAttemptId: (id: string | null) => void;
}

export const useAttemptStore = create<AttemptState>()((set) => ({
  attemptId: "",
  setAttemptId: (attemptId) => set({ attemptId }),
}));
