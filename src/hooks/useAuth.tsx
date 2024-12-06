import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const useAuth = () => {
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [token, router]);

  if (loading) {
    return { loading: true, token: null };
  }

  return { loading: false, token };
};

export default useAuth;
