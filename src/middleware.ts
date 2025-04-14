import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import type { UserRole } from './types/permissions'

// Define route access by role
const roleRouteAccess: Record<UserRole, string[]> = {
  super_admin: ['/dashboard/*'],
  super_admin_staff: ['/dashboard/*'],
  school_admin: [
    '/dashboard/staff',
    '/dashboard/teachers',
    '/dashboard/students',
    '/dashboard/classes',
    '/dashboard/subjects',
    '/dashboard/settings'
  ],
  staff: [
    '/dashboard/students',
    '/dashboard/attendance',
    '/dashboard/grades',
    '/dashboard/classes',
    '/dashboard/subjects'
  ],
  teacher: [
    '/dashboard/classes',
    '/dashboard/grades',
    '/dashboard/attendance',
    '/dashboard/students',
    '/dashboard/subjects'
  ],
  student: [
    '/dashboard/grades',
    '/dashboard/attendance',
    '/dashboard/schedule',
    '/dashboard/subjects'
  ]
}

export async function middleware(request: Request) {
  try {
    // Get the session token from cookies
    const sessionCookie = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('session='))
    
    if (!sessionCookie) {
      return redirectToLogin(request)
    }

    const token = sessionCookie.split('=')[1]
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }

    // Verify and decode the token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    const role = payload.role as UserRole
    const path = new URL(request.url).pathname

    // Check if user has access to this route
    const hasAccess = roleRouteAccess[role].some(route => {
      const pattern = new RegExp('^' + route.replace('*', '.*') + '$')
      return pattern.test(path)
    })

    if (!hasAccess) {
      // Redirect to appropriate dashboard based on role
      switch (role) {
        case 'super_admin':
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

function redirectToLogin(request: Request) {
  const url = new URL('/auth/school/signin', request.url)
  url.searchParams.set('callbackUrl', new URL(request.url).pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/dashboard/:path*',
  ],
}
