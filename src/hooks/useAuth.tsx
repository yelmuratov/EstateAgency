'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { setAuthToken } from "@/lib/tokenHelper";
import { UserStore } from "@/store/userStore";
import { useToast } from "@/hooks/use-toast";

const useAuth = () => {
  const { token, setToken } = useAuthStore(); // Manage token state
  const { setUser, user } = UserStore(); // Manage user state
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const userData = await getUser(); // Fetch user data
        setUser(userData.user); // Save user data in the store
        setAuthToken(userData.token); // Set token for API requests
        setToken(userData.token); // Update token in the store if refreshed
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
        });
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, [token, router, setUser, setToken, toast]);

  return { loading, user };
};

export default useAuth;
