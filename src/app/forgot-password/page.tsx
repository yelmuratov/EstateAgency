'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Eye, EyeOff } from 'lucide-react'
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
import { useToast } from '@/hooks/use-toast'

export default function ForgotPasswordPage() {
  const { step, resetPassword, verifyCode, sendEmail, resendCode: resendCodeFromStore } = useForgotPasswordStore()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
    try {
      await sendEmail(data.email)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
      toast({
        title: "Ошибка",
        description: (error instanceof Error ? error.message : 'Unknown error'),
        variant: "destructive",
      })
    }
  }

  const onSubmitCode = async (data: CodeSchema) => {
    try {
      await verifyCode(data.code)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const onSubmitPassword = async (data: PasswordSchema) => {
    try {
      await resetPassword(data?.confirmPassword);
      setError(null);
      setSuccess('Пароль успешно сброшен');
    } catch {
      console.error('onSubmitPassword error:', error);
      setError('Произошла непредвиденная ошибка')
    }
  }

  const handleResendCode = async () => {
    setError(null)
    try {
      await resendCodeFromStore();
      setSuccess('Код сброса отправлен повторно');
      setError(null);
    } catch (error) {
      console.error('handleResendCode error:', error);
      setError('Произошла непредвиденная ошибка')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Сброс пароля</CardTitle>
          <CardDescription>
            {step === 'email' && "Введите вашу почту для получения кода сброса"}
            {step === 'code' && "Введите код, отправленный на вашу почту"}
            {step === 'password' && "Создайте новый пароль"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {step === 'email' && (
            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Почта</Label>
                <Input
                  id="email"
                  type="email"
                  {...emailForm.register('email')}
                  placeholder="Введите вашу почту"
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
                Отправить код сброса
              </Button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={codeForm.handleSubmit(onSubmitCode)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Код сброса</Label>
                <Input
                  id="code"
                  {...codeForm.register('code')}
                  placeholder="Введите 6-значный код"
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
                Проверить код
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendCode}
              >
                Отправить код повторно
              </Button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Новый пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...passwordForm.register('password')}
                  placeholder="Введите новый пароль"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...passwordForm.register('confirmPassword')}
                  placeholder="Подтвердите новый пароль"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Сбросить пароль
            </Button>
          </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => window.location.href = '/login'}>
            Назад к входу
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
