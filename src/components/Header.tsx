"use client";

import React, { useState, useEffect } from "react";
import { Plus, ArrowLeft, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Spinner from "@/components/local-components/spinner";
import ThemeToggle from "@/components/ThemeToggle";
import { UserStore } from "@/store/userStore";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api"; 
import { useIsSuperUser } from '@/hooks/useIsSuperUser';

interface HeaderProps {
  type?: string;
  action_type?: "rent" | "sale";
}

interface IObjectCount {
  total: number;
  land: number;
  apartment: number;
  commercial: number;
  land_rent: number;
  apartment_rent: number;
  commercial_rent: number;
  land_sale: number;
  apartment_sale: number;
  commercial_sale: number;
}

const Header: React.FC<HeaderProps> = ({action_type,type}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [objectCount, setObjectCount] = useState<IObjectCount>();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logoutUser } = UserStore();
  const { clearToken, token } = useAuthStore();
  const isAddPropertyPage = pathname === "/add-property";
  const [isSuperUser] = useIsSuperUser();

  // Fetch the object count
  useEffect(() => {
    const fetchObjectCount = async () => {
      try {
        const response = await api.get("/additional/get_all_object/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setObjectCount(response.data);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load object count.",
          variant: "destructive",
        });
      }
    };

    fetchObjectCount();
  }, [token]);

  const handleAddPropertySelect = (path: string) => {
    if (pathname === path) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
      router.push(path);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      clearToken();

      toast({
        variant: "default",
        title: "Logged out successfully",
        description: "You have been logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
        action: <ToastAction altText="Try again">Попробуйте снова</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Back Button or Search */}
          <div className="flex items-center w-full sm:w-auto">
            {isAddPropertyPage ? (
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Назад
                </Link>
              </Button>
            ) : (
              <h1 className="text-xl font-semibold text-primary">
                Панель {
                  isSuperUser ? "Админ" : "сотрудинка"
                } 
              </h1>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {!isAddPropertyPage && (
              <>
                <span className="text-sm text-muted-foreground hidden md:block">
                    {objectCount ? (
                    action_type === "rent" ? (
                      type === "lands" ? `${objectCount.land_rent} участков в аренду` :
                      type === "apartments" ? `${objectCount.apartment_rent} квартир в аренду` :
                      type === "commercial" ? `${objectCount.commercial_rent} коммерческих объектов в аренду` :
                      `${objectCount.total} объектов в аренду`
                    ) : (
                      type === "lands" ? `${objectCount.land_sale} участков на продажу` :
                      type === "apartments" ? `${objectCount.apartment_sale} квартир на продажу` :
                      type === "commercial" ? `${objectCount.commercial_sale} коммерческих объектов на продажу` :
                      `${objectCount.total} объектов на продажу`
                    )
                    ) : "Загрузка..."}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" /> Добавить Объект
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-50">
                    <DropdownMenuItem
                      onClick={() => handleAddPropertySelect("/add-apartment")}
                    >
                      Добавить Квартиру
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleAddPropertySelect("/add-commercial")
                      }
                    >
                      Добавить Коммерческую
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAddPropertySelect("/add-land")}
                    >
                      Добавить Участок
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAddPropertySelect("/add-client")}
                    >
                      Добавить Клиента                    
                    </DropdownMenuItem>
                    {/* Dovabnit pokaz */}
                    <DropdownMenuItem
                      onClick={() => handleAddPropertySelect("/add-view")}
                    >
                      Добавить Показ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  <p className="font-semibold">
                    {user?.full_name || "Имя пользователя"}
                  </p>
                  <p>{user?.phone || "Телефон"}</p>
                </div>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner theme="light" />
        </div>
      )}
    </header>
  );
};

export default Header;
