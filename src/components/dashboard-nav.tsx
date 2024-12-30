"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, LayoutDashboard, Home, Trees, Building2, Users, Eye, FileCheck, MapPin, Train, Info, Calculator, History } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  selectedType: { main: string; sub: "rent" | "sale" }
  onTypeChange: (main: string, sub: "rent" | "sale") => void
  isSuperUser: boolean|null
}

export function AppSidebar({ selectedType, onTypeChange, isSuperUser }: AppSidebarProps) {
  const router = useRouter()

  const navigationItems = [
    { title: "Квартиры", value: "apartments", icon: Home },
    { title: "Участки", value: "lands", icon: Trees },
    { title: "Коммерция", value: "commercial", icon: Building2 },
    { title: "Клиенты", value: "clients", icon: Users },
    { title: "Показы", value: "views", icon: Eye },
    { title: "Сделки", value: "deals", icon: FileCheck },
  ]

  const superUserItems = [
    { title: "Пользователи", path: "/users", icon: Users },
    { title: "Районы", path: "/districts", icon: MapPin },
    { title: "Метро", path: "/metros", icon: Train },
    { title: "Информация о входах", path: "/info", icon: Info },
    { title: "Отчетность", path: "/accounting", icon: Calculator },
  ]

  return (
    <Sidebar 
      collapsible="icon" 
      style={{ "--sidebar-width": "17vw"} as React.CSSProperties}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <LayoutDashboard className="h-4 w-4" />
              <span className="ml-4">Панель управления</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex-shrink-0">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <Collapsible
              key={item.value}
              defaultOpen={false} // Set to false to keep the sidebar closed by default
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={selectedType.main === item.value && selectedType.sub === "sale"}
                        onClick={() => onTypeChange(item.value, "sale")}
                      >
                        <button>Продажа</button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={selectedType.main === item.value && selectedType.sub === "rent"}
                        onClick={() => onTypeChange(item.value, "rent")}
                      >
                        <button>Аренда</button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              onClick={() => router.push("/change-log")}
            >
              <button>
                <History className="h-4 w-4 shrink-0" />
                <span>Лог изменений</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isSuperUser && superUserItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                onClick={() => router.push(item.path)}
              >
                <button>
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}