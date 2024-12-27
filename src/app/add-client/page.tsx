"use client";

import { ClientForm } from "@/components/clients/client-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

export default function PropertyPage() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <Button
        type="button"
        className="w-32 mt-4 flex items-center"
        onClick={() => router.push("/")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11.414V14a1 1 0 11-2 0V6.586l-2.293 2.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 6.586z"
        clipRule="evenodd"
          />
        </svg>
        Назад
      </Button>
      <div className="container mx-auto py-10">
        <Tabs defaultValue="rent" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rent">Аренда</TabsTrigger>
            <TabsTrigger value="sale">Продажа</TabsTrigger>
          </TabsList>
          <TabsContent value="rent" className="space-y-6">
            <ClientForm type="rent" />
          </TabsContent>

          <TabsContent value="sale" className="space-y-6">
            <ClientForm type="sale" />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </DashboardLayout>
  );
}
