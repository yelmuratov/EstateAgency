'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useForgotPasswordStore } from '@/store/forgotPasswordStore'
import {
  emailSchema,
  codeSchema,
  passwordSchema,
  type EmailSchema,
  type CodeSchema,
  type PasswordSchema,
} from '@/lib/forgot-password'
import { sendResetCode, verifyResetCode, resetPassword } from '../actions/forgot-password'

export default function ForgotPasswordPage() {
  const { step, email, code, setStep, setEmail, setCode } = useForgotPasswordStore()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const emailForm = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
  })

  const codeForm = useForm<CodeSchema>({
    resolver: zodResolver(codeSchema),
  })

  const passwordForm = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmitEmail = async (data: EmailSchema) => {
    setError(null)
    try {
      const result = await sendResetCode(data)
      if (result.success) {
        setEmail(data.email)
        setStep('code')
        setSuccess('Reset code sent to your email')
      } else {
        setError(result.error ?? 'An unexpected error occurred')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    }
  }

  const onSubmitCode = async (data: CodeSchema) => {
    setError(null)
    try {
      const result = await verifyResetCode(email, data)
      if (result.success) {
        setCode(data.code)
        setStep('password')
        setSuccess('Code verified successfully')
      } else {
        setError(result.error ?? 'An unexpected error occurred')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    }
  }

  const onSubmitPassword = async (data: PasswordSchema) => {
    setError(null)
    try {
      const result = await resetPassword(email, code, data)
      if (result.success) {
        setSuccess('Password reset successfully')
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        setError(result.error ?? 'An unexpected error occurred')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    }
  }

  const resendCode = async () => {
    setError(null)
    try {
      const result = await sendResetCode({ email })
      if (result.success) {
        setSuccess('Reset code resent to your email')
      } else {
        setError(result.error ?? 'An unexpected error occurred')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {step === 'email' && "Enter your email to receive a reset code"}
            {step === 'code' && "Enter the code sent to your email"}
            {step === 'password' && "Create a new password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {step === 'email' && (
            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...emailForm.register('email')}
                  placeholder="Enter your email"
                />
                {emailForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={emailForm.formState.isSubmitting}
              >
                {emailForm.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send Reset Code
              </Button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={codeForm.handleSubmit(onSubmitCode)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Reset Code</Label>
                <Input
                  id="code"
                  {...codeForm.register('code')}
                  placeholder="Enter 6-digit code"
                />
                {codeForm.formState.errors.code && (
                  <p className="text-sm text-red-500">
                    {codeForm.formState.errors.code.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={codeForm.formState.isSubmitting}
              >
                {codeForm.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Verify Code
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={resendCode}
              >
                Resend Code
              </Button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...passwordForm.register('password')}
                  placeholder="Enter new password"
                />
                {passwordForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register('confirmPassword')}
                  placeholder="Confirm new password"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Reset Password
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => window.location.href = '/login'}>
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

