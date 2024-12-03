import { z } from 'zod'

export const loginSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  password: z.string().min(5, 'Password must be at least 6 characters'),
})

// TypeScript type for validation
export type LoginFormData = z.infer<typeof loginSchema>
