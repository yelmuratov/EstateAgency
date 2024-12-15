"use client";

import LandPropertyForm  from "@/components/forms/LandForm";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";


export default function AddLandPage() {
  const router = useRouter(); // Use Next.js useRouter hook
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
          Добавить новый участок
        </h1>
        <LandPropertyForm />
      </div>
    </DashboardLayout>
  );
}
