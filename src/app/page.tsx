"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/local-components/spinner";
import { useTheme } from "next-themes";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useToast } from "@/hooks/use-toast"; 
import PropertyTable from '@/components/PropertyTable'
import useAuth from "@/hooks/useAuth";

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true); 
  const { theme, setTheme } = useTheme(); 
  const router = useRouter();
  const { token } = useAuthStore();
  const { toast } = useToast(); 
  useAuth();
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        router.push("/login"); // Redirect if no token
        return;
      }
      try {
        const userData = await getUser();
        setUser(userData); // Set the user data
      } catch (error) {
        console.error("Failed to fetch user data:", error);

        toast({
          variant: "destructive",
          title: "Error!",
          description: "Unable to fetch user data. Redirecting to login...",
        });

        router.push("/login"); // Redirect to login on error
      } finally {
        setLoading(false); // Fetching is complete
      }
    };

    fetchUserData();
  }, [token, router, toast]);

  // Show spinner while loading
  if (loading) {
    return <Spinner theme={theme || 'light'} />; // Pass the current theme or default to 'light'
  }

  // Show error message only if loading is complete and user is still null
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Unable to load user data. Please log in again.</p>
      </div>
    );
  }

  // Render dashboard when user is available
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Недвижимость</h1>
      <PropertyTable />
    </DashboardLayout>
  );
}
