"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

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
    },
    {
      href: "/dashboard/classes",
      label: "Classes",
      active: pathname === "/dashboard/classes",
    },
    {
      href: "/dashboard/lessons",
      label: "Lessons",
      active: pathname === "/dashboard/lessons",
    },
    {
      href: "/dashboard/students",
      label: "Students",
      active: pathname === "/dashboard/students",
    },
    {
      href: "/dashboard/teachers",
      label: "Teachers",
      active: pathname === "/dashboard/teachers",
    },
    {
      href: "/dashboard/announcements",
      label: "Announcements",
      active: pathname === "/dashboard/announcements",
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
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
  )
}
