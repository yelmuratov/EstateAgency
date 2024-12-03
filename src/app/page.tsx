"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import LogoutButton from "@/components/local-components/logoutButton";
import Spinner from "@/components/local-components/spinner";
import Head from "next/head";
import { useTheme } from "next-themes";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useToast } from "@/hooks/use-toast"; // Import useToast

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const { theme, setTheme } = useTheme(); // Access theme and setTheme
  const router = useRouter();
  const { token } = useAuthStore();
  const { toast } = useToast(); // Destructure toast

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

        // Show error toast
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
    return <Spinner />;
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
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <div>
        <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
            >
              Toggle Theme
            </button>
            <LogoutButton />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
