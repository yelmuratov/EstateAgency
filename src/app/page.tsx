'use client';

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useReportWebVitals } from 'next/web-vitals';
import { useRouter } from "next/navigation";
import { getUser } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/local-components/spinner";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { setAuthToken } from "@/lib/tokenHelper";
import { UserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

// Lazy-load heavy components
const ApartmentTable = dynamic(() => import('@/components/tables/apartmentTabel'));
const LandTable = dynamic(() => import('@/components/tables/landTable'));
const CommercialTable = dynamic(() => import('@/components/tables/commercialTable'));

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("apartments");
  const { theme } = useTheme();
  const router = useRouter();
  const { token } = useAuthStore();
  const { toast } = useToast();
  const { setUser, user } = UserStore();

  useAuth();

  useReportWebVitals((metric) => {
    setTimeout(() => console.log(metric), 0); // Log Web Vitals asynchronously
  });

  const fetchUserData = useCallback(async () => {
    if (!token) {
      router.push("/login"); // Redirect if no token
      return;
    }
    try {
      const userData = await getUser();
      setUser(userData.user);
      setAuthToken(userData.token);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: (error instanceof Error ? error.message : "An unexpected error occurred."),
      });
      router.push("/login"); // Redirect to login on error
    } finally {
      setLoading(false); // Fetching is complete
    }
  }, [token, router, toast, setUser]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    localStorage.setItem("selectedType", type); // Save to localStorage
  };

  useEffect(() => {
    // Load selected type from localStorage
    const type = localStorage.getItem("selectedType") || "apartments";
    setSelectedType(type);
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return <Spinner theme={theme || "dark"} />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Unable to load user data. Please log in again.</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Выберите тип недвижимости</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Тип: {getLabel(selectedType)}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleTypeChange("apartments")}>
              Квартиры
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTypeChange("lands")}>
              Участки
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTypeChange("commercial")}>
              Коммерция
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedType === "apartments" && <ApartmentTable />}
      {selectedType === "lands" && <LandTable />}
      {selectedType === "commercial" && <CommercialTable />}
    </DashboardLayout>
  );
}

// Helper function to map type to label
function getLabel(type: string): string {
  switch (type) {
    case "apartments":
      return "Квартиры";
    case "lands":
      return "Участки";
    case "commercial":
      return "Коммерция";
    default:
      return "Неизвестно";
  }
}
