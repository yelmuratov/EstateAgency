'use client';

import ApartmentForm from "@/components/forms/ApartmentForm";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { UserStore } from "@/store/userStore";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

export default function AddApartmentPage() {
  const router = useRouter(); 
  const { user } = UserStore();
  useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Avoid rendering the page content if user is being redirected
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <Toaster />
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push('/')} // Redirect to home page
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад
      </Button>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Добавить новую квартиру</h1>
        <ApartmentForm />
      </div>
    </DashboardLayout>
  );
}
