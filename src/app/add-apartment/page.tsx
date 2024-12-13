"use client";

import ApartmentForm from "@/components/forms/ApartmentForm";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

export default function AddApartmentPage() {
  return (
    <DashboardLayout>
      <Toaster />
      <Button
        type="button"
        variant="outline"
        onClick={() => (window.location.href = "/")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад
      </Button>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Добавить новую квартиру
        </h1>
        <ApartmentForm />
      </div>
    </DashboardLayout>
  );
}
