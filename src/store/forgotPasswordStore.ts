import { create } from 'zustand'
import api from '@/lib/api'
import { AxiosError } from 'axios'

type ForgotPasswordStep = 'email' | 'code' | 'password'

interface ForgotPasswordStore {
  step: ForgotPasswordStep
  email: string
  code: string
  setStep: (step: ForgotPasswordStep) => void
  setEmail: (email: string) => void
  setCode: (code: string) => void
  reset: () => void,
  sendEmail: (email:string) => void,
  verifyCode: (code:string) => void,
  resetPassword: (password:string) => void,
  resendCode: () => void;
}

export const useForgotPasswordStore = create<ForgotPasswordStore>((set) => ({
  step: 'email',
  email: '',
  code: '',
  setStep: (step) => set({ step }),
  setEmail: (email) => set({ email }),
  setCode: (code) => set({ code }),
  reset: () => set({ step: 'email', email: '', code: '' }),
  sendEmail: async (email: string) => {
    try {
      await api.post(`/auth/forgot_password/?email=${email}`);
      set({ step: 'code', email });
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        const apiError = error.response.data as { detail?: string };
        if (apiError.detail) {
          throw new Error(apiError.detail); // Throw the error detail
        } else {
          throw new Error('An unexpected error occurred. Please try again.');
        }
      } else {
        throw new Error('An unknown error occurred. Please try again.');
      }
    }
  },
  verifyCode: async (code: string) => {
    try {
      const email = useForgotPasswordStore.getState().email;
      await api.post(`/auth/forgot_password/?email=${email}&code=${code}`);
      set({ step: 'password' });
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        const apiError = error.response.data as { detail?: string };
        if (apiError.detail) {
          return apiError.detail; // Return the error detail
        } else {
          return 'An unexpected error occurred. Please try again.';
        }
      } else {
        return 'An unknown error occurred. Please try again.';
      }
    }
  },
  resetPassword: async (password: string) => {
    try {
      const email = useForgotPasswordStore.getState().email;
      await api.post(`/auth/forgot_password/?email=${email}&new_password=${password}`);
      set({ step: 'email', email: '', code: '' });
      return null;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        const apiError = error.response.data as { detail?: string };
        if (apiError.detail) {
          return apiError.detail; // Return the error detail
        } else {
          return 'An unexpected error occurred. Please try again.';
        }
      } else {
        return 'An unknown error occurred. Please try again.';
      }
    }
  },
  resendCode: async () => {
    try {
      const email = useForgotPasswordStore.getState().email;
      await api.post(`/auth/forgot_password/?email=${email}`);
      return null;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        const apiError = error.response.data as { detail?: string };
        if (apiError.detail) {
          return apiError.detail; // Return the error detail
        } else {
          return 'An unexpected error occurred. Please try again.';
        }
      } else {
        return 'An unknown error occurred. Please try again.';
      }
    }
  }
}))

