'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditUserForm from "@/components/forms/edit-user-form";
import { useIsSuperUser } from '@/hooks/useIsSuperUser';

export default function EditUserPage() {
  const [isSuperUser, loading] = useIsSuperUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isSuperUser === false) {
      router.push('/404');
    }
  }, [loading, isSuperUser, router]);

  if (loading || isSuperUser === false) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      <EditUserForm />
    </div>
  );
}
