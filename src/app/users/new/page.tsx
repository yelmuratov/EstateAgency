'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateUserForm from "@/components/forms/create-user-form";
import { useIsSuperUser } from '@/hooks/useIsSuperUser';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Spinner from '@/components/local-components/spinner';

export default function NewUserPage() {
  const [isSuperUser, loading] = useIsSuperUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isSuperUser === false) {
      router.push('/404');
    }
  }, [loading, isSuperUser, router]);

  if (loading || isSuperUser === false) {
    return <Spinner theme='dark' />;
  }

  return (
    <DashboardLayout>
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Создать пользователя
      </h1>
      <CreateUserForm />
    </div>
    </DashboardLayout>
  );
}

