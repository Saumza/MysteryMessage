import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

    const token = await getToken({ req: request })
    const { pathname } = request.nextUrl

    if (token &&
        (
            pathname.startsWith('/sign-up') ||
            pathname.startsWith('/sign-in') ||
            pathname.startsWith('/verify')
        )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (!token && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))

    }
}

export const config = {
    matcher: [
        '/sign-up',
        '/sign-in',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ],
}