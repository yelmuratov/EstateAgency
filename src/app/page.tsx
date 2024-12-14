'use client';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/local-components/spinner";
import { ThemeProvider, useTheme } from "next-themes";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { setAuthToken } from "@/lib/tokenHelper";
import { UserStore } from "@/store/userStore";
import LandTable from "@/components/tables/landTable";
import ApartmentTable from "@/components/tables/apartmentTabel";
import CommercialTable from "@/components/tables/commercialTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("selectedType") || "apartments"
      : "apartments"
  ); // Default type with localStorage check
  const { theme } = useTheme();
  const router = useRouter();
  const { token } = useAuthStore();
  const { toast } = useToast();
  const { setUser, user } = UserStore();

  useAuth();

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
        description: "Unable to fetch user data. Redirecting to login...",
      });

      router.push("/login"); // Redirect to login on error
    } finally {
      setLoading(false); // Fetching is complete
    }
  }, [token, router, toast]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    localStorage.setItem("selectedType", type); // Save to localStorage
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return <Spinner theme={theme || "light"} />;
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
