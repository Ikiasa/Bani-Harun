import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/login' || path === '/signup' || path === '/buku-keluarga' || path.startsWith('/buku-keluarga/') || path === '/silsilah'
    const token = request.cookies.get('bh-auth-token')?.value

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (path === '/login' && token) {
        // If already logged in, redirect to dashboard
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - family-photos (images directory)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|family-photos).*)',
    ],
}
