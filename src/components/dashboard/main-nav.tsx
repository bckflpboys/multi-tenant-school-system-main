"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

interface UserData {
  name: string;
  email: string;
  userType: 'super-admin' | 'student' | 'teacher' | 'principal';
  schoolName?: string;
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
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm font-medium text-gray-900">{user?.name || 'Loading...'}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.userType}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-gray-200 bg-white">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt={user?.name || 'User'} />
                <AvatarFallback className="bg-blue-500 text-white">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : '...'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900">
                  {user?.name || 'Loading...'}
                </p>
                <p className="text-xs leading-none text-gray-500">
                  {user?.email || 'Loading...'}
                </p>
                <p className="text-xs leading-none text-gray-500 capitalize">
                  {user?.userType}
                  {user?.schoolName && ` • ${user.schoolName}`}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-gray-700 cursor-pointer hover:bg-gray-100">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 cursor-pointer hover:bg-gray-100">
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer hover:bg-red-50">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
