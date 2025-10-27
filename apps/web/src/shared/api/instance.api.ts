import { FetchClient } from '@/shared/utils/fetch'

export const api = new FetchClient({
	baseUrl: process.env.HTTP_HOST as string,
	options: {
		credentials: 'include',
	},
})
