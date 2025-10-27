import { type NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
	const { url, cookies } = request

	const session = cookies.get('refreshToken')?.value
	const pathname = request.nextUrl.pathname

	if (pathname === '/') {
		return NextResponse.next()
	}

	const isAuthPage = pathname.startsWith('/auth')

	if (isAuthPage) {
		if (session) {
			return NextResponse.redirect(new URL('/profile', url))
		}

		return NextResponse.next()
	}

	if (!session) {
		return NextResponse.redirect(new URL('/auth/login', url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next|_static|favicon.ico).*)'],
}
