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
import { LogOut, Settings, User, Shield, Building2, Mail, Bell } from "lucide-react"
import { NotificationButton } from "@/components/notifications/notification-button"
import { useSession } from "next-auth/react"
import Image from "next/image"

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
  const { data: session } = useSession()
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
    <div className="flex items-center w-full bg-white border-b border-gray-200 px-4 py-2.5">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 mr-8">
        <div className="relative h-8 w-8">
          <Image
            src="/praxix-icon.svg"
            alt="Praxix"
            fill
            className="object-contain"
            priority
          />
        </div>
        <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Praxix
        </span>
      </Link>

      <nav className={cn("flex items-center space-x-1", className)} {...props}>
        {routes
          .filter(route => route.show !== false)
          .map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                route.active 
                  ? "bg-blue-50 text-blue-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {route.label}
              {route.active && (
                <div className="h-1 w-1 rounded-full bg-blue-600" />
              )}
            </Link>
          ))}
      </nav>

      {/* User Profile Dropdown */}
      <div className="ml-auto flex items-center gap-4">
        {user && <NotificationButton userId={user.id} />}
        <div className="hidden md:flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="flex flex-col items-end gap-0.5">
            <p className="text-sm font-semibold text-gray-900 leading-none">
              {user?.name ? user.name.split(' ')[0] : 'Loading...'}
            </p>
            <p className="text-xs text-gray-500 capitalize leading-none">
              {user?.userType}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 p-0.5"
              >
                <Avatar className="h-full w-full border-2 border-white rounded-full">
                  {session?.user?.image ? (
                    <AvatarImage src={session.user.image} alt={session.user.name || ""} />
                  ) : (
                    <AvatarFallback className="bg-blue-600 text-white font-medium">
                      {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-80 p-2 bg-white border border-gray-200 shadow-md" 
              align="end"
              sideOffset={8}
            >
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-[3px] border-white shadow-sm">
                    {session?.user?.image ? (
                      <AvatarImage src={session.user.image} alt={session.user.name || ""} />
                    ) : (
                      <AvatarFallback className="bg-blue-600 text-white text-xl font-medium">
                        {session?.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white bg-green-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold leading-none text-gray-900">
                      {user?.name || 'Loading...'}
                    </p>
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      {
                        'bg-purple-500': user?.userType === 'super-admin',
                        'bg-blue-500': user?.userType === 'principal',
                        'bg-green-500': user?.userType === 'teacher',
                        'bg-orange-500': user?.userType === 'student',
                      }
                    )} />
                  </div>
                  <p className="text-sm text-gray-600">
                    {user?.email || 'Loading...'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium shadow-sm text-gray-900",
                      {
                        'bg-purple-100 border border-purple-200': user?.userType === 'super-admin',
                        'bg-blue-100 border border-blue-200': user?.userType === 'principal',
                        'bg-green-100 border border-green-200': user?.userType === 'teacher',
                        'bg-orange-100 border border-orange-200': user?.userType === 'student',
                      }
                    )}>
                      <Shield className="h-3 w-3" />
                      {user?.userType}
                    </span>
                    {user?.schoolName && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">
                        <Building2 className="h-3 w-3" />
                        {user.schoolName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <DropdownMenuItem className="flex items-center gap-2 p-3 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50 border border-gray-200 shadow-sm transition-colors">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Profile</span>
                    <span className="text-xs text-gray-500">View your profile</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 p-3 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50 border border-gray-200 shadow-sm transition-colors">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                    <Settings className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Settings</span>
                    <span className="text-xs text-gray-500">Manage account</span>
                  </div>
                </DropdownMenuItem>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <DropdownMenuItem className="flex items-center gap-2 p-3 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50 border border-gray-200 shadow-sm transition-colors">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                    <Bell className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Notifications</span>
                    <span className="text-xs text-gray-500">View alerts</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 p-3 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50 border border-gray-200 shadow-sm transition-colors">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                    <Mail className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Messages</span>
                    <span className="text-xs text-gray-500">Check inbox</span>
                  </div>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="my-2 border-gray-200" />
              
              <DropdownMenuItem 
                onClick={handleSignOut} 
                className="flex items-center gap-3 p-3 text-red-600 cursor-pointer rounded-lg hover:bg-red-50 border border-red-200 transition-colors"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Sign out</span>
                  <span className="text-xs text-red-500">Exit your account</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
