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
import { useIsSuperUser } from "@/hooks/useIsSuperUser";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
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
const ClientTableWrapper = dynamic(() => import('@/components/clients/client-table-wrapper'), {
  ssr: false,
  loading: () => <Spinner theme="light" />,
});
const ViewTable = dynamic(() => import('@/components/views/view-table').then(mod => mod.ViewsTable), {
  ssr: false,
  loading: () => <Spinner theme="light" />,
});

type PropertyType = {
  main: string;
  sub: 'rent' | 'sale';
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [isSuperUser] = useIsSuperUser();
  const [selectedType, setSelectedType] = useState<PropertyType>(() => {
    if (typeof window !== 'undefined') {
      const savedType = localStorage.getItem("selectedType");
      return savedType ? JSON.parse(savedType) : { main: "apartments", sub: 'sale' };
    }
    return { main: "apartments", sub: 'sale' };
  });
  
  const router = useRouter();
  const { token } = useAuthStore();
  const { toast } = useToast();
  const { setUser } = UserStore();

  useAuth();

  const fetchUserData = useCallback(async () => {
    if (!token) {
      router.push("/login");
      return;
    }
  
    try {
      const userData = await getUser();
  
      if (!userData) {
        throw new Error("Не удалось получить данные пользователя.");
      }
  
      setUser({ ...userData.user, id: userData.user.id.toString() });
      setAuthToken(userData.token);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Произошла непредвиденная ошибка при получении данных пользователя.";
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: errorMessage,
      });
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [token, router, toast, setUser]); 

  const handleTypeChange = (main: string, sub: 'rent' | 'sale') => {
    const newType = { main, sub };
    setSelectedType(newType);

    if (typeof window !== 'undefined') {
      localStorage.setItem("selectedType", JSON.stringify(newType));
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("selectedType", JSON.stringify(selectedType));
    }
  }, [selectedType]);

  if (loading || !token) {
    return <Spinner theme="light" />;
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Выберите тип недвижимости</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {getLabel(selectedType.main)} - {selectedType.sub === 'rent' ? 'Аренда' : 'Продажа'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Квартиры</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handleTypeChange("apartments", "sale")}>
                    Продажа
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("apartments", "rent")}>
                    Аренда
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Участки</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handleTypeChange("lands", "sale")}>
                    Продажа
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("lands", "rent")}>
                    Аренда
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Коммерция</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleTypeChange("commercial", "sale")}>
                Продажа
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTypeChange("commercial", "rent")}>
                Аренда
                </DropdownMenuItem>
              </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Клиенты
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleTypeChange("clients", "sale")}>
                Продажа
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTypeChange("clients", "rent")}>
                Аренда
                </DropdownMenuItem>
              </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Просмотры
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleTypeChange("views", "sale")}>
                Продажа
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTypeChange("views", "rent")}>
                Аренда
                </DropdownMenuItem>
              </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {
              isSuperUser && (
                <>
                  <DropdownMenuItem
                    onClick={() => router.push("/users")}
                  >
                    Пользователи
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => router.push("/districts")}
                  >
                    Районы
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/metros")}
                  >
                    Метро
                  </DropdownMenuItem>
                  {/* change log */}
                  <DropdownMenuItem
                    onClick={() => router.push("/change-log")}
                  >
                    Лог изменений
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/info")}
                  >
                    Информация о входах
                  </DropdownMenuItem>
                </>
              )
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        {selectedType.main === "apartments" && <ApartmentTable type={selectedType.sub} />}
        {selectedType.main === "lands" && <LandTable type={selectedType.sub} />}
        {selectedType.main === "commercial" && <CommercialTable type={selectedType.sub} />}
        {selectedType.main === "clients" && <ClientTableWrapper type={selectedType.sub} />}
        {selectedType.main === "views" && <ViewTable data={[]} type={selectedType.sub} />}
      </div>
    </DashboardLayout>
  );
}

function getLabel(type: string): string {
  const labels: Record<string, string> = {
    apartments: "Квартиры",
    lands: "Участки",
    commercial: "Коммерция",
    clients: "Клиенты",
    views: "Просмотры",
  };
  return labels[type] || "Неизвестно";
}
