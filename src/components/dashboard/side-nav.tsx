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
  BookOpenCheck,
  UserSquare2,
  ClipboardCheck,
  Shield,
  CalendarDays,
  Newspaper,
  Building2,
  Wallet,
} from "lucide-react"
import { useFeatureAccess } from "@/hooks/useFeatureAccess"
import type { UserRole } from "@/types/permissions"

// Mock data - replace with real data from your auth system
const mockUser = {
  role: 'school_admin' as UserRole,
  schoolId: '123',
  subscription: {
    schoolId: '123',
    tier: 'premium' as const,
    features: {
      // Override default tier settings
      blog: false, // Disable blog even though it's in premium
    },
    customFeatures: {
      api_access: true, // Enable API access even though it's enterprise
    }
  }
}

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your school system",
    feature: 'dashboard', // Always accessible
  },
  {
    title: "Schools",
    href: "/dashboard/schools",
    icon: Building2,
    description: "Manage multiple schools and campuses",
    feature: 'schools', // Super admin only
    superAdminOnly: true,
  },
  {
    title: "Classes",
    href: "/dashboard/classes",
    icon: BookOpen,
    description: "Manage your classes and schedules",
    feature: 'classes',
  },
  {
    title: "Lessons",
    href: "/dashboard/lessons",
    icon: BookOpenCheck,
    description: "View and manage lessons",
    feature: 'lessons',
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: Users,
    description: "View and manage student records",
    feature: 'students',
  },
  {
    title: "Teachers",
    href: "/dashboard/teachers",
    icon: GraduationCap,
    description: "Manage teaching staff",
    feature: 'teachers',
  },
  {
    title: "Parents",
    href: "/dashboard/parents",
    icon: UserSquare2,
    description: "Parent information and communication",
    feature: 'parents',
  },
  {
    title: "Finances",
    href: "/dashboard/finances",
    icon: Wallet,
    description: "Manage fees, payments and expenses",
    feature: 'finances',
  },
  {
    title: "Examinations",
    href: "/dashboard/examinations",
    icon: ClipboardCheck,
    description: "Manage exams, tests and assessments",
    feature: 'examinations',
  },
  {
    title: "Discipline",
    href: "/dashboard/discipline",
    icon: Shield,
    description: "Track and manage student conduct",
    feature: 'discipline',
  },
  {
    title: "School Life",
    href: "/dashboard/school-life",
    icon: CalendarDays,
    description: "Events, activities, and campus life",
    feature: 'school_life',
  },
  {
    title: "Blog",
    href: "/dashboard/blog",
    icon: Newspaper,
    description: "School news and announcements",
    feature: 'blog',
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    description: "School communication hub",
    feature: 'messages',
  },
  {
    title: "Announcements",
    href: "/dashboard/announcements",
    icon: Bell,
    description: "Post and manage announcements",
    feature: 'announcements',
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "System configuration",
    feature: 'settings',
  },
]

export function SideNav() {
  const pathname = usePathname()
  const { hasAccess } = useFeatureAccess({
    userRole: mockUser.role,
    schoolId: mockUser.schoolId,
    schoolSubscription: mockUser.subscription,
  })

  const visibleItems = sidebarNavItems.filter(item => {
    if (item.superAdminOnly && mockUser.role !== 'super_admin') {
      return false
    }
    return item.feature === 'dashboard' || hasAccess(item.feature)
  })

  return (
    <nav className="grid items-start gap-1.5">
      {visibleItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex items-center gap-4 rounded-lg px-4 py-3 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100/60",
              isActive && "bg-gray-200/70 text-gray-900 font-medium"
            )}
          >
            <Icon className={cn(
              "h-5 w-5 flex-shrink-0",
              isActive ? "text-blue-600" : "text-gray-400"
            )} />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-sm font-medium truncate leading-none">
                {item.title}
              </span>
              <span className={cn(
                "text-xs truncate leading-relaxed",
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
