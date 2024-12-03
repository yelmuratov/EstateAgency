import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const useAuth = () => {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isClient, setIsClient] = useState(false); // Ensure we're on the client side
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    setIsClient(true); // Set client-side flag

    if (isClient) {
      if (!token) {
        router.push("/login"); // Redirect to login if unauthenticated
      } else {
        setLoading(false); // Token exists, stop loading
      }
    }
  }, [token, router, isClient]);

  // While client-side check is pending or redirecting, return `loading`
  if (loading || !isClient) {
    return { loading: true, token: null };
  }

  return { loading: false, token }; // Return token for additional use if needed
};

export default useAuth;
