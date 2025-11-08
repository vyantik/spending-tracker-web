import { type NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
	const { url, cookies } = request
	const pathname = request.nextUrl.pathname
	const session = cookies.get('refreshToken')?.value

	const publicPaths = ['/', '/auth']
	const isPublicPath = publicPaths.some(
		path => pathname === path || pathname.startsWith(`${path}/`),
	)

	if (isPublicPath) {
		const isAuthPage = pathname.startsWith('/auth')

		if (isAuthPage && session) {
			return NextResponse.redirect(new URL('/profile', url))
		}

		return NextResponse.next()
	}

	if (!session) {
		const loginUrl = new URL('/auth/login', url)
		loginUrl.searchParams.set('redirect', pathname)
		return NextResponse.redirect(loginUrl)
	}

	return NextResponse.next()
}

export const config = {
	// Исключаем статические файлы, API роуты, Next.js внутренние файлы и файлы с расширениями
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - файлы с расширениями (изображения, шрифты, и т.д.)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next/webpack-hmr).*)',
	],
}
