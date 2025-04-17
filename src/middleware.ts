import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { UserRole } from './types/permissions'
import type { NextRequest } from 'next/server'
import type { GetTokenParams } from 'next-auth/jwt'

// Define route access by role
const roleRouteAccess: Record<UserRole, string[]> = {
  super_admin: ['/dashboard/*'],
  super_admin_staff: ['/dashboard/*'],
  school_admin: [
    '/dashboard',
    '/dashboard/staff',
    '/dashboard/teachers',
    '/dashboard/students',
    '/dashboard/classes',
    '/dashboard/subjects',
    '/dashboard/parents',
    '/dashboard/examinations',
    '/dashboard/discipline',
    '/dashboard/grade-levels',
    '/dashboard/lessons',
    '/dashboard/lessons/timetable',
    '/dashboard/settings'
  ],
  staff: [
    '/dashboard/students',
    '/dashboard/attendance',
    '/dashboard/grades',
    '/dashboard/classes',
    '/dashboard/examinations',
    '/dashboard/subjects'
  ],
  teacher: [
    '/dashboard/classes',
    '/dashboard/grades',
    '/dashboard/attendance',
    '/dashboard/students',
    '/dashboard/lessons/timetable',
    '/dashboard/lessons',
    '/dashboard/examinations',
    '/dashboard/subjects'
  ],
  student: [
    '/dashboard/grades',
    '/dashboard/attendance',
    '/dashboard/schedule',
    '/dashboard/lessons/timetable',
    '/dashboard/lessons',
    '/dashboard/examinations',
    '/dashboard/subjects'
  ]
}

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    } as GetTokenParams)

    if (!token) {
      return redirectToLogin(request)
    }

    const role = token.role as UserRole
    const path = new URL(request.url).pathname

    // Super admin can access all routes except school-specific ones
    if (role === 'super_admin') {
      // If trying to access school-specific routes, redirect to dashboard
      if (path.startsWith('/dashboard/classes') || 
          path.startsWith('/dashboard/students') ||
          path.startsWith('/dashboard/grades')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return NextResponse.next()
    }

    // Check if user has access to this route
    const hasAccess = roleRouteAccess[role]?.some(route => {
      const pattern = new RegExp('^' + route.replace('*', '.*') + '$')
      return pattern.test(path)
    })

    if (!hasAccess) {
      // Redirect to appropriate dashboard based on role
      switch (role as UserRole) {
        case 'super_admin':
          return NextResponse.redirect(new URL('/dashboard', request.url))
        case 'super_admin_staff':
          return NextResponse.redirect(new URL('/dashboard', request.url))
        case 'school_admin':
          return NextResponse.redirect(new URL('/dashboard/staff', request.url))
        case 'staff':
          return NextResponse.redirect(new URL('/dashboard/students', request.url))
        case 'teacher':
          return NextResponse.redirect(new URL('/dashboard/classes', request.url))
        case 'student':
          return NextResponse.redirect(new URL('/dashboard/grades', request.url))
        default:
          return NextResponse.redirect(new URL('/', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return redirectToLogin(request)
  }
}

function redirectToLogin(request: NextRequest) {
  const isAdminRoute = request.url.includes('/super-admin')
  const signInUrl = isAdminRoute ? '/auth/super-admin/signin' : '/auth/school/signin'
  const url = new URL(signInUrl, request.url)
  url.searchParams.set('callbackUrl', new URL(request.url).pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/schools/:schoolId/:path*',  // Only protect school-specific routes
    '/api/users/:path*'
  ]
}
