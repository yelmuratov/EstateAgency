'use client';

import { useState, useEffect } from 'react';
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
import Head from 'next/head';
import {setAuthToken} from '@/lib/tokenHelper';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setToken, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      router.push('/');
    }
  }, [token, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData, event?: React.BaseSyntheticEvent) => {
    if (event) {
      event.preventDefault(); // Prevent the default form submission behavior
    }
    setError(null);
    setIsLoading(true);
  
    try {
      const { access_token } = await login(data.phone, data.password);
      setToken(access_token);
      setAuthToken(access_token);
      router.push('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4">
      <Head>
        <title>Login Page</title>
      </Head>
      <Card className="w-full max-w-sm sm:max-w-md bg-white dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-lg sm:text-xl">Login</CardTitle>
        </CardHeader>
        <form onSubmit={(e) => handleSubmit(onSubmit)(e)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="phone" className="text-sm sm:text-base">
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+998"
                {...register('phone')}
                className="w-full"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
            <div className="space-y-4">
              <Label htmlFor="password" className="text-sm sm:text-base">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className="w-full"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            {error && (
              <div className="text-red-500 flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full py-2 sm:py-3 text-sm sm:text-base"
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
