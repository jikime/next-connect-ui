"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CheckSquare,
  CreditCard,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
  FileAudio,
  AlertTriangle,
  Briefcase,
  Calendar,
  Building2,
  Zap,
  Command,
  Search,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

export function AppSidebar() {
  const pathname = usePathname()
  const [aiModalOpen, setAIModalOpen] = useState(false)

  const mainItems = [
    {
      name: "Main",
      href: "/",
      icon: LayoutDashboard,
      isActive: pathname === "/",
    },
    {
      name: "Collections",
      href: "/collections",
      icon: FolderKanban,
      isActive: pathname.startsWith("/collections"),
    },
    {
      name: "Documents",
      href: "/documents",
      icon: CheckSquare,
      isActive: pathname.startsWith("/documents"),
    },
    {
      name: "Search",
      href: "/search",
      icon: Search,
      isActive: pathname.startsWith("/search"),
    },
    {
      name: "API Tester",
      href: "/api-tester",
      icon: Building2,
      isActive: pathname.startsWith("/api-tester"),
    },
  ]

  return (
    <>
      <Sidebar variant="inset" collapsible="icon" >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <span className="text-md">🔗</span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-lg">LangConnect</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain title="메인" items={mainItems} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </>
  )
}