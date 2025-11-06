import { FetchError } from './fetch-error'
import { RequestOptions, TypeSearchParams } from './fetch-types'

export class FetchClient {
	private baseUrl: string
	public headers?: Record<string, string>
	public params?: TypeSearchParams
	public options?: RequestOptions

	public constructor(init: {
		baseUrl: string
		headers?: Record<string, string>
		params?: TypeSearchParams
		options?: RequestOptions
	}) {
		this.baseUrl = init.baseUrl
		this.headers = init.headers
		this.options = init.options
		this.params = init.params
	}

	private createSearchParams(params: TypeSearchParams): string {
		const searchParams = new URLSearchParams()

		for (const key in { ...this.params, ...params }) {
			if (Object.prototype.hasOwnProperty.call(params, key)) {
				const value = params[key]

				if (Array.isArray(value)) {
					value.forEach(currentValue => {
						if (currentValue) {
							searchParams.append(key, currentValue.toString())
						}
					})
				} else if (value) {
					searchParams.set(key, value.toString())
				}
			}
		}

		return `?${searchParams.toString()}`
	}

	private getAccessToken(): string | null {
		if (typeof window === 'undefined') {
			return null
		}
		return localStorage.getItem('access_token')
	}

	private async clearRefreshToken(): Promise<void> {
		if (typeof window === 'undefined') {
			return
		}

		const normalizedBaseUrl = this.baseUrl.endsWith('/')
			? this.baseUrl.slice(0, -1)
			: this.baseUrl

		try {
			fetch(`${normalizedBaseUrl}/auth/logout`, {
				method: 'POST',
				credentials: 'include',
			}).catch(() => {})
		} catch {}
	}

	private async request<T>(
		endpoint: string,
		method: RequestInit['method'],
		options: RequestOptions = {},
	): Promise<T> {
		const normalizedEndpoint = endpoint.startsWith('/')
			? endpoint.slice(1)
			: endpoint
		const normalizedBaseUrl = this.baseUrl.endsWith('/')
			? this.baseUrl.slice(0, -1)
			: this.baseUrl
		let url = `${normalizedBaseUrl}/${normalizedEndpoint}`

		if (options.params) {
			url += this.createSearchParams(options.params)
		}

		const { headers: optionHeaders, params: _, ...restOptions } = options
		const { headers: thisOptionHeaders, ...restThisOptions } =
			this.options || {}

		const token = this.getAccessToken()
		const authHeaders: Record<string, string> = token
			? { Authorization: `Bearer ${token}` }
			: {}

		const config: RequestInit = {
			...restOptions,
			...restThisOptions,
			method,
			headers: {
				...this.headers,
				...thisOptionHeaders,
				...authHeaders,
				...optionHeaders,
			},
		}

		const response: Response = await fetch(url, config)

		if (!response.ok) {
			const error = (await response.json()) as
				| { message: string }
				| undefined

			if (response.status === 401) {
				this.clearRefreshToken().catch(() => {})
			}

			throw new FetchError(
				response.status,
				error?.message || response.statusText,
			)
		}

		if (
			response.headers.get('Content-Type')?.includes('application/json')
		) {
			return (await response.json()) as unknown as T
		} else {
			return (await response.text()) as unknown as T
		}
	}

	public async get<T>(
		endpoint: string,
		options: Omit<RequestOptions, 'body'> = {},
	): Promise<T> {
		return await this.request<T>(endpoint, 'GET', options)
	}

	public async post<T>(
		endpoint: string,
		body?: Record<string, string>,
		options: RequestOptions = {},
	): Promise<T> {
		return await this.request(endpoint, 'POST', {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options?.headers || {}),
			},
			...(!!body && { body: JSON.stringify(body) }),
		})
	}

	public async put<T>(
		endpoint: string,
		body?: Record<string, any>,
		options: RequestOptions = {},
	): Promise<T> {
		return await this.request(endpoint, 'PUT', {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options?.headers || {}),
			},
			...(!!body && { body: JSON.stringify(body) }),
		})
	}

	public async delete<T>(
		endpoint: string,
		options: Omit<RequestOptions, 'body'> = {},
	): Promise<T> {
		return await this.request(endpoint, 'DELETE', options)
	}

	public async patch<T>(
		endpoint: string,
		body?: Record<string, any>,
		options: RequestOptions = {},
	): Promise<T> {
		return await this.request(endpoint, 'PATCH', {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options?.headers || {}),
			},
			...(!!body && { body: JSON.stringify(body) }),
		})
	}
}
