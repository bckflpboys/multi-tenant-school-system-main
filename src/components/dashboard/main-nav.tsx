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
      href: "/dashboard/classes",
      label: "Classes",
      active: pathname === "/dashboard/classes",
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
            "text-sm transition-colors hover:text-gray-900 relative py-1",
            route.active
              ? "text-blue-600 font-medium before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:bg-blue-600 before:content-['']"
              : "text-gray-500 hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:h-0.5 hover:before:w-full hover:before:bg-gray-200 hover:before:content-['']"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
