'use client';

import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas/authSchema';
import { useAuthStore } from '@/store/authStore';
import { login } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { setAuthToken } from '@/lib/tokenHelper';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const router = useRouter();
  const { setToken } = useAuthStore();

  // Handle redirection after login
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/');
    }
  }, [shouldRedirect, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const { access_token } = await login(data.phone, data.password);
      setToken(access_token);
      setAuthToken(access_token);
      setShouldRedirect(true); // Trigger the redirect after successful login
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.detail || "Invalid phone number or password.";
        setError(errorMessage);
      } else if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-xl transition-transform hover:scale-105">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Log in to your account to continue
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 px-6">
            {/* Phone Input */}
            <div className="space-y-4">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+998"
                {...register('phone')}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.phone?.message && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-4">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.password?.message && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Button
                variant="link"
                className="px-0 font-normal text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                onClick={() => router.push('/forgot-password')}
              >
                Forgot password?
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 px-4 py-2 rounded-md flex items-center gap-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
          </CardContent>

          {/* Submit Button */}
          <CardFooter className="px-6">
            <Button
              className="w-full py-3 text-sm bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition-all"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

