import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ProjectDraftValues {
  name: string;
  description: string;
  teamId: string;
  startDate: string;
  endDate: string;
}

interface ProjectDraftState {
  step: number;
  values: ProjectDraftValues;
  setDraft: (draft: { step: number; values: ProjectDraftValues }) => void;
  clearDraft: () => void;
}

export const EMPTY_PROJECT_DRAFT: ProjectDraftValues = {
  name: "",
  description: "",
  teamId: "",
  startDate: "",
  endDate: "",
};

// Keeps the half filled "New project" form. If the owner closes the dialog
// by mistake, or reloads the page, the form comes back as they left it.
// The draft lives in sessionStorage, so it is gone when the tab is closed.
export const useProjectDraft = create<ProjectDraftState>()(
  persist(
    (set) => ({
      step: 0,
      values: EMPTY_PROJECT_DRAFT,
      setDraft: (draft) => set(draft),
      clearDraft: () => set({ step: 0, values: EMPTY_PROJECT_DRAFT }),
    }),
    {
      name: "workline-project-draft",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
