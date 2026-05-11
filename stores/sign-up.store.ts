import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SignUpState {
  email: string;
  fullname: string;
  password: string;
  hasHydrated: boolean;
  resendAvailableAt: number;

  setEmail: (email: string) => void;
  setFullname: (fullname: string) => void;
  setPassword: (password: string) => void;
  setResendAvailableAt: (timestamp: number) => void;
  clear: () => void;
}

export const RESEND_COOLDOWN_SECONDS = 60 * 5;

export const useSignUpStore = create<SignUpState>()(
  persist(
    (set) => ({
      email: "",
      fullname: "",
      password: "",
      hasHydrated: false,
      resendAvailableAt: -1,

      setEmail: (email) => set({ email }),
      setFullname: (fullname) => set({ fullname }),
      setPassword: (password) => set({ password }),
      setResendAvailableAt: (timestamp) => set({ resendAvailableAt: timestamp }),
      clear: () =>
        set({
          email: "",
          fullname: "",
          password: "",
          resendAvailableAt: -1,
        }),
    }),
    {
      name: "sign-up-store",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
