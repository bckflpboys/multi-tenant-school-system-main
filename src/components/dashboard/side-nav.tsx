"use client"

import { useState } from "react"
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
  UsersRound,
  BookText,
  ChevronRight,
} from "lucide-react"
import { LucideIcon } from "lucide-react"
import { useFeatureAccess } from "@/hooks/useFeatureAccess"
import type { UserRole } from "@/types/permissions"
import { Button } from "@/components/ui/button"

// Mock data - replace with real data from your auth system
const mockUser = {
  role: 'super_admin' as UserRole,
  schoolId: '123',
  subscription: {
    schoolId: '123',
    tier: 'standard' as const,
    features: {
      dashboard: true,
      schools: true,
      principals: true,
      students: true,
      teachers: true,
      parents: true,
      staff: true,
      classes: true,
      lessons: true,
      examinations: true,
      discipline: true,
      finances: true,
      blog: true,
      messages: true,
      announcements: true,
      settings: true,
      school_life: true,
      grade_levels: true,
      subjects: true,
    },
    customFeatures: {
      api_access: true,
    }
  }
}

type NavSection = {
  title: string
  items: NavItem[]
}

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  description: string
  feature: string
  superAdminOnly?: boolean
}

const sidebarNavSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview of your school system",
        feature: 'dashboard',
      },
    ]
  },
  {
    title: "Administration",
    items: [
      {
        title: "Schools",
        href: "/dashboard/schools",
        icon: Building2,
        description: "Manage multiple schools and campuses",
        feature: 'schools',
        superAdminOnly: true,
      },
      {
        title: "Principals",
        href: "/dashboard/principals",
        icon: UsersRound,
        description: "Manage school principals",
        feature: 'principals',
        superAdminOnly: true,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        description: "System configuration",
        feature: 'settings',
      },
    ]
  },
  {
    title: "People",
    items: [
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
        title: "Staff",
        href: "/dashboard/staff",
        icon: UsersRound,
        description: "Manage all school staff members",
        feature: 'staff',
      },
    ]
  },
  {
    title: "Academics",
    items: [
      {
        title: "Grade Levels",
        href: "/dashboard/grade-levels",
        icon: GraduationCap,
        description: "Manage grade levels and sections",
        feature: 'grade_levels',
      },
      {
        title: "Subjects",
        href: "/dashboard/subjects",
        icon: BookText,
        description: "Manage school subjects and curriculum",
        feature: 'subjects',
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
        title: "Examinations",
        href: "/dashboard/examinations",
        icon: ClipboardCheck,
        description: "Manage exams, tests and assessments",
        feature: 'examinations',
      },
    ]
  },
  {
    title: "Monitoring",
    items: [
      {
        title: "Attendance",
        href: "/dashboard/attendance",
        icon: ClipboardCheck,
        description: "Track and manage attendance",
        feature: 'students',
      },
      {
        title: "School Performance",
        href: "/dashboard/performance",
        icon: BookOpenCheck,
        description: "View school progress and metrics",
        feature: 'students',
      },
      {
        title: "Discipline",
        href: "/dashboard/discipline",
        icon: Shield,
        description: "Track and manage student conduct",
        feature: 'discipline',
      },
    ]
  },
  {
    title: "Finance",
    items: [
      {
        title: "Finances",
        href: "/dashboard/finances",
        icon: Wallet,
        description: "Manage fees, payments and expenses",
        feature: 'finances',
      },
    ]
  },
  {
    title: "Communication",
    items: [
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
    ]
  },
]

export function SideNav() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const { hasAccess } = useFeatureAccess({
    userRole: mockUser.role,
    schoolId: mockUser.schoolId,
    schoolSubscription: mockUser.subscription,
  })

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  const isItemVisible = (item: NavItem) => {
    if (item.superAdminOnly && mockUser.role !== 'super_admin') {
      return false
    }
    return item.feature === 'dashboard' || hasAccess(item.feature)
  }

  return (
    <nav className="grid gap-2 px-2">
      {sidebarNavSections.map((section) => {
        const visibleItems = section.items.filter(isItemVisible)
        if (visibleItems.length === 0) return null

        const isExpanded = expandedSections.includes(section.title)
        const hasActiveItem = visibleItems.some(item => pathname === item.href)

        return (
          <div key={section.title} className="space-y-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between px-2 hover:bg-gray-100/60 font-medium text-sm",
                (isExpanded || hasActiveItem) 
                  ? "text-blue-600 bg-blue-50/50" 
                  : "text-gray-700"
              )}
              onClick={() => toggleSection(section.title)}
            >
              {section.title}
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "transform rotate-90",
                (isExpanded || hasActiveItem) ? "text-blue-600" : "text-gray-400"
              )} />
            </Button>

            {isExpanded && (
              <div className="grid gap-1 pl-2">
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-gray-100/60",
                        isActive 
                          ? "bg-blue-50 text-blue-600" 
                          : "text-gray-600"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 flex-shrink-0 transition-colors mt-0.5",
                        isActive 
                          ? "text-blue-600" 
                          : "text-gray-400 group-hover:text-gray-600"
                      )} />
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className={cn(
                          "truncate leading-none font-medium",
                          isActive ? "text-blue-600" : "text-gray-700"
                        )}>
                          {item.title}
                        </span>
                        <span className={cn(
                          "text-[11px] truncate leading-tight",
                          isActive 
                            ? "text-blue-500/90" 
                            : "text-gray-500"
                        )}>
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
