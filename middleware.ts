import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Force dynamic rendering for routes that use localStorage
  const dynamicRoutes = [
    '/screens/allocator/data-rooms',
    '/screens/allocator/ddq-review', 
    '/screens/allocator/manager-profile',
    '/screens/manager/ddq-response',
    '/login'
  ]

  const pathname = request.nextUrl.pathname
  
  // Check if the current path matches any dynamic routes
  const isDynamicRoute = dynamicRoutes.some(route => pathname.startsWith(route))
  
  if (isDynamicRoute) {
    // Add a header to indicate this should be rendered dynamically
    const response = NextResponse.next()
    response.headers.set('x-dynamic-render', 'true')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/screens/allocator/:path*',
    '/screens/manager/:path*',
    '/login'
  ],
}
