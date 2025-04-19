"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { LogOut, Settings, User } from "lucide-react"
import { NotificationButton } from "@/components/notifications/notification-button"

interface UserData {
  id: string
  name: string
  email: string
  userType: 'super-admin' | 'student' | 'teacher' | 'principal'
  schoolId: string
  schoolName?: string
}

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) throw new Error('Failed to fetch user data')
        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleSignOut = async () => {
    try {
      const callbackUrl = user?.userType === 'super-admin' 
        ? '/auth/super-admin/signin'
        : '/auth/school/signin'

      await signOut({ 
        redirect: false,
        callbackUrl 
      })
      
      toast.success('Signed out successfully')
      router.push(callbackUrl)
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  const routes = [
    {
      href: "/dashboard",
      label: "Overview",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/schools",
      label: "Schools",
      active: pathname === "/dashboard/schools",
      // Only show for super admin
      show: user?.userType === 'super-admin'
    },
    {
      href: "/dashboard/classes",
      label: "Classes",
      active: pathname === "/dashboard/classes",
      // Show for all school users
      show: user?.userType !== 'super-admin'
    },
    {
      href: "/dashboard/lessons",
      label: "Lessons",
      active: pathname === "/dashboard/lessons",
      // Show for teachers and students
      show: ['teacher', 'student'].includes(user?.userType || '')
    },
    {
      href: "/dashboard/students",
      label: "Students",
      active: pathname === "/dashboard/students",
      // Show for teachers and principals
      show: ['teacher', 'principal'].includes(user?.userType || '')
    },
    {
      href: "/dashboard/teachers",
      label: "Teachers",
      active: pathname === "/dashboard/teachers",
      // Show for principals only
      show: user?.userType === 'principal'
    },
    {
      href: "/dashboard/announcements",
      label: "Announcements",
      active: pathname === "/dashboard/announcements",
      // Show for all users
      show: true
    },
  ]

  return (
    <div className="flex items-center w-full">
      <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
        {routes
          .filter(route => route.show !== false)
          .map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100/60",
                route.active && "text-blue-600 font-medium"
              )}
            >
              {route.label}
            </Link>
          ))}
      </nav>

      {/* User Profile Dropdown */}
      <div className="ml-auto flex items-center gap-3">
        {user && <NotificationButton userId={user.id} schoolId={user.schoolId} />}
        <div className="hidden md:flex flex-col items-end gap-0">
          <p className="text-base font-medium text-gray-900 leading-tight">
            {user?.name ? user.name.split(' ')[0] : 'Loading...'}
          </p>
          <p className="text-[11px] text-gray-500 capitalize leading-tight">
            {user?.userType}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-10 w-10 rounded-full border-2 border-gray-200 bg-white hover:border-blue-500 transition-colors"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt={user?.name || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-xl font-medium text-white">
                  {user?.name ? user.name.split(' ')[0].slice(0, 2).toUpperCase() : '...'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 shadow-lg rounded-xl p-2" align="end" forceMount>
            <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 shadow-md">
              <Avatar className="h-16 w-16 border-2 border-blue-100">
                <AvatarImage src="/avatars/01.png" alt={user?.name || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-xl font-medium text-white">
                  {user?.name ? user.name.split(' ')[0].slice(0, 2).toUpperCase() : '...'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-lg font-semibold leading-none text-gray-900">
                  {user?.name || 'Loading...'}
                </p>
                <p className="text-sm text-gray-500">
                  {user?.email || 'Loading...'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border-2 text-gray-900 shadow",
                    {
                      'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200': user?.userType === 'super-admin',
                      'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200': user?.userType === 'principal',
                      'bg-gradient-to-br from-green-50 to-green-100 border-green-200': user?.userType === 'teacher',
                      'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200': user?.userType === 'student',
                    }
                  )}>
                    {user?.userType}
                  </span>
                  {user?.schoolName && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border-2 border-gray-200 shadow">
                      {user.schoolName}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <DropdownMenuItem className="flex items-center gap-2 p-3 text-gray-700 cursor-pointer rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 p-3 text-gray-700 cursor-pointer rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="my-2 border-gray-200" />
            <DropdownMenuItem 
              onClick={handleSignOut} 
              className="flex items-center gap-2 p-3 text-red-600 cursor-pointer rounded-lg bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 shadow hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
