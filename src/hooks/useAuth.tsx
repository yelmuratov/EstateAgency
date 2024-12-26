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
        const userData = await getUser(); // Получить данные пользователя
        if (userData && userData.user) {
          setUser({ ...userData.user, id: userData.user.id.toString() }); // Сохранить данные пользователя в хранилище
        }
        if (userData) {
          setAuthToken(userData.token); // Установить токен для API запросов
        }
        if (userData) {
          setToken(userData.token); // Обновить токен в хранилище, если он был обновлен
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка!",
          description: error instanceof Error ? error.message : "Произошла непредвиденная ошибка.",
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
