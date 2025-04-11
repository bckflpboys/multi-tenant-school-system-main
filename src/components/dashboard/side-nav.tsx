"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Bell,
  Settings,
} from "lucide-react"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your school system",
  },
  {
    title: "Classes",
    href: "/dashboard/classes",
    icon: BookOpen,
    description: "Manage your classes and schedules",
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: Users,
    description: "View and manage student records",
  },
  {
    title: "Teachers",
    href: "/dashboard/teachers",
    icon: GraduationCap,
    description: "Manage teaching staff",
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    description: "School communication hub",
  },
  {
    title: "Announcements",
    href: "/dashboard/announcements",
    icon: Bell,
    description: "Post and manage announcements",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "System configuration",
  },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-1">
      {sidebarNavItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-2 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100/60",
              isActive && "bg-gray-200/70 text-gray-900 font-medium"
            )}
          >
            <Icon className={cn(
              "h-5 w-5 flex-shrink-0",
              isActive ? "text-blue-600" : "text-gray-400"
            )} />
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <span className="truncate">
                {item.title}
              </span>
              <span className={cn(
                "text-xs truncate",
                isActive ? "text-gray-500" : "text-gray-400"
              )}>
                {item.description}
              </span>
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
