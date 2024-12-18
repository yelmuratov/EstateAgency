"use client";

import CommercialForm from "@/components/forms/CommercialForm";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { UserStore } from "@/store/userStore";
import useAuth from "@/hooks/useAuth";


export default function AddCommercialPage() {
  const router = useRouter(); // Use Next.js useRouter hook

  const { user } = UserStore();
  useAuth();

  if (!user) {
    router.push("/login");
    return null; // Prevent further rendering until redirection
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
        <h1 className="text-2xl font-bold mb-6 text-center">
          Добавить коммерческую недвижимость
        </h1>
        <CommercialForm />
      </div>
    </DashboardLayout>
  );
}
