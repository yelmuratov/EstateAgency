import { create } from 'zustand'

type ForgotPasswordStep = 'email' | 'code' | 'password'

interface ForgotPasswordStore {
  step: ForgotPasswordStep
  email: string
  code: string
  setStep: (step: ForgotPasswordStep) => void
  setEmail: (email: string) => void
  setCode: (code: string) => void
  reset: () => void
}

export const useForgotPasswordStore = create<ForgotPasswordStore>((set) => ({
  step: 'email',
  email: '',
  code: '',
  setStep: (step) => set({ step }),
  setEmail: (email) => set({ email }),
  setCode: (code) => set({ code }),
  reset: () => set({ step: 'email', email: '', code: '' })
}))

