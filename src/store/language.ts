import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "as";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggle: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
      toggle: () =>
        set((state) => ({
          language: state.language === "en" ? "as" : "en",
        })),
    }),
    {
      name: "nejobsportal-language",
    }
  )
);
