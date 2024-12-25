'use server'

import { z } from 'zod'
import { emailSchema, codeSchema, passwordSchema } from '@/lib/forgot-password'

export async function sendResetCode(data: z.infer<typeof emailSchema>) {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to send reset code' }
  }
}

export async function verifyResetCode(email: string, data: z.infer<typeof codeSchema>) {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Invalid reset code' }
  }
}

export async function resetPassword(
  email: string,
  code: string,
  data: z.infer<typeof passwordSchema>
) {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to reset password' }
  }
}

