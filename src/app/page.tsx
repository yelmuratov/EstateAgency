"use client";

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
import { useIsSuperUser } from "@/hooks/useIsSuperUser";
import {AppSidebar} from "@/components/dashboard-nav";
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

// Lazy-load heavy components
const ApartmentTable = dynamic(
  () => import("@/components/tables/apartmentTabel"),
  {
    ssr: false,
    loading: () => <Spinner theme="light" />,
  }
);
const LandTable = dynamic(() => import("@/components/tables/landTable"), {
  ssr: false,
  loading: () => <Spinner theme="light" />,
});
const CommercialTable = dynamic(
  () => import("@/components/tables/commercialTable"),
  {
    ssr: false,
    loading: () => <Spinner theme="light" />,
  }
);
const ClientTableWrapper = dynamic(
  () => import("@/components/clients/client-table-wrapper"),
  {
    ssr: false,
    loading: () => <Spinner theme="light" />,
  }
);
const ViewTable = dynamic(
  () => import("@/components/views/view-table").then((mod) => mod.ViewsTable),
  {
    ssr: false,
    loading: () => <Spinner theme="light" />,
  }
);
const DealsTable = dynamic(
  () => import("@/components/deals/deal-table").then((mod) => mod.DealsTable),
  {
    ssr: false,
    loading: () => <Spinner theme="light" />,
  }
);

type PropertyType = {
  main: string;
  sub: "rent" | "sale";
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [isSuperUser] = useIsSuperUser();
  const [selectedType, setSelectedType] = useState<PropertyType>(() => {
    if (typeof window !== "undefined") {
      const savedType = localStorage.getItem("selectedType");
      return savedType
        ? JSON.parse(savedType)
        : { main: "apartments", sub: "sale" };
    }
    return { main: "apartments", sub: "sale" };
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

  const handleTypeChange = (main: string, sub: "rent" | "sale") => {
    const newType = { main, sub };
    setSelectedType(newType);

    if (typeof window !== "undefined") {
      localStorage.setItem("selectedType", JSON.stringify(newType));
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedType", JSON.stringify(selectedType));
    }
  }, [selectedType]);

  if (loading || !token) {
    return <Spinner theme="light" />
  }

  return (
    <DashboardLayout type={selectedType.main} action_type={selectedType.sub}>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          isSuperUser={isSuperUser}
        />
        <SidebarInset className="flex-shrink-0">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {getLabel(selectedType.main)} - {selectedType.sub === "rent" ? "Аренда" : "Продажа"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {selectedType.main === "apartments" && (
              <ApartmentTable type={selectedType.sub} />
            )}
            {selectedType.main === "lands" && <LandTable type={selectedType.sub} />}
            {selectedType.main === "commercial" && (
              <CommercialTable type={selectedType.sub} />
            )}
            {selectedType.main === "clients" && (
              <ClientTableWrapper type={selectedType.sub} />
            )}
            {selectedType.main === "views" && (
              <ViewTable data={[]} type={selectedType.sub} />
            )}
            {selectedType.main === "deals" && (
              <DealsTable data={[]} type={selectedType.sub} />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardLayout>
  );
}

function getLabel(type: string): string {
  const labels: Record<string, string> = {
    apartments: "Квартиры",
    lands: "Участки",
    commercial: "Коммерция",
    clients: "Клиенты",
    views: "Показы",
    deals: "Сделки",
  };
  return labels[type] || "Неизвестно";
}
