'use client';

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
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

// Lazy-load heavy components
const ApartmentTable = dynamic(() => import('@/components/tables/apartmentTabel'), {
  ssr: false,
  loading: () => <Spinner theme="light" />,
});
const LandTable = dynamic(() => import('@/components/tables/landTable'), {
  ssr: false,
  loading: () => <Spinner theme="light" />,
});
const CommercialTable = dynamic(() => import('@/components/tables/commercialTable'), {
  ssr: false,
  loading: () => <Spinner theme="light" />,
});

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("apartments");
  const router = useRouter();
  const { token } = useAuthStore();
  const { toast } = useToast();
  const { setUser } = UserStore();

  useAuth();

  const fetchUserData = useCallback(async () => {
    if (!token) {
      router.replace("/login");
      return;
    }
  
    try {
      const userData = await getUser();
  
      if (!userData) {
        throw new Error("Failed to retrieve user data.");
      }
  
      setUser({ ...userData.user, id: userData.user.id.toString() }); // Convert id to string
      setAuthToken(userData.token); // Assuming `setAuthToken` is a utility function
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching user data.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
  
      router.replace("/login"); // Redirect to login if an error occurs
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  }, [token, router, toast, setUser]); 

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    localStorage.setItem("selectedType", type); 
  };

  useEffect(() => {
    const savedType = localStorage.getItem("selectedType") || "apartments";
    setSelectedType(savedType);
    fetchUserData();
  }, [fetchUserData]);

  // Prevent rendering if user isn't authenticated
  if (loading || !token) {
    return <Spinner theme="light" />;
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

      <div>
        {selectedType === "apartments" && <ApartmentTable />}
        {selectedType === "lands" && <LandTable />}
        {selectedType === "commercial" && <CommercialTable />}
      </div>
    </DashboardLayout>
  );
}

// Helper function to map type to label
function getLabel(type: string): string {
  const labels: Record<string, string> = {
    apartments: "Квартиры",
    lands: "Участки",
    commercial: "Коммерция",
  };
  return labels[type] || "Неизвестно";
}
