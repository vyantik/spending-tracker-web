/**
 * Проверяет наличие access token в localStorage
 */
export function hasAccessToken(): boolean {
	if (typeof window === 'undefined') {
		return false
	}
	return !!localStorage.getItem('access_token')
}

/**
 * Проверяет наличие refresh token cookie
 */
export function hasRefreshToken(): boolean {
	if (typeof window === 'undefined') {
		return false
	}
	return document.cookie.split(';').some(cookie => {
		return cookie.trim().startsWith('refreshToken=')
	})
}

/**
 * Проверяет, залогинен ли пользователь (есть ли хотя бы один токен)
 */
export function isAuthenticated(): boolean {
	return hasAccessToken() || hasRefreshToken()
}
