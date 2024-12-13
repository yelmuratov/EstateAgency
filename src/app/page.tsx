"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/local-components/spinner";
import { useTheme } from "next-themes";
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useToast } from "@/hooks/use-toast"; 
import PropertyTable from '@/components/PropertyTable';
import useAuth from "@/hooks/useAuth";
import { setAuthToken } from "@/lib/tokenHelper";
import {UserStore} from '@/store/userStore';
import LandTable from "@/components/tables/landTable";
import ApartmentTable from "@/components/tables/apartmentTabel";
import CommercialTable from "@/components/tables/commercialTable";

export default function Dashboard() {
  const [loading, setLoading] = useState(true); 
  const { theme } = useTheme(); 
  const router = useRouter();
  const { token, } = useAuthStore();
  const { toast } = useToast(); 
  const {setUser,user} = UserStore();

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

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return <Spinner theme={theme || 'light'} />;
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
      <LandTable />
      <ApartmentTable />
      <CommercialTable />
    </DashboardLayout>
  );
}
