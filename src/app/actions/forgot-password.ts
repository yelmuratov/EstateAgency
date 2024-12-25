'use server'
import api from '@/lib/api'

import { z } from 'zod'
import { emailSchema, codeSchema, passwordSchema } from '@/lib/forgot-password'

export async function sendResetCode(data: z.infer<typeof emailSchema>) {
  console.log('sendResetCode called with data:', data);
  try {
    await api.post('/auth/forgot_password', { params: data });
    return { success: true }
  } catch (error) {
    console.error('sendResetCode error:', error);
    return { success: false, error: 'Failed to send reset code' }
  }
}

export async function verifyResetCode(email: string, data: z.infer<typeof codeSchema>) {
  console.log('verifyResetCode called with email:', email, 'and data:', data);
  try {
    await api.post('/auth/forgot_password', { params: { email, code: data.code } });
    return { success: true }
  } catch (error) {
    console.error('verifyResetCode error:', error);
    return { success: false, error: 'Invalid reset code' }
  }
}

export async function resetPassword(
  email: string,
  data: z.infer<typeof passwordSchema>
) {
  console.log('resetPassword called with email:', email, 'and data:', data);
  try {
    await api.post('/auth/forgot_password', { params: { email, password: data.password } });
    return { success: true }
  } catch (error) {
    console.error('resetPassword error:', error);
    return { success: false, error: 'Failed to reset password' }
  }
}

