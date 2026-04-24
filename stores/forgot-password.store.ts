import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ForgotPasswordState {
  otp: string;
  email: string;
  hasHydrated: boolean;
  resendAvailableAt: number;

  setOtp: (otp: string) => void;
  setEmail: (email: string) => void;
  setResendAvailableAt: (timestamp: number) => void;
  clear: () => void;
}

export const RESEND_COOLDOWN_SECONDS = 60 * 5;

export const useForgotPasswordStore = create<ForgotPasswordState>()(
  persist(
    (set) => ({
      otp: "",
      email: "",
      hasHydrated: false,
      resendAvailableAt: -1,

      setOtp: (otp) => set({ otp }),
      setEmail: (email) => set({ email }),
      setResendAvailableAt: (timestamp) => set({ resendAvailableAt: timestamp }),
      clear: () =>
        set({
          otp: "",
          email: "",
          resendAvailableAt: -1,
        }),
    }),
    {
      name: "forgot-password-store",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
