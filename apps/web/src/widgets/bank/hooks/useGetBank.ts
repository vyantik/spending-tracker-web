'use client'

import { useQuery } from '@tanstack/react-query'

import { FetchError } from '@/shared/utils/fetch'
import { bankService } from '@/widgets'

export function useGetBank() {
	const {
		data: bank,
		isLoading: isLoadingBank,
		isError: isBankGetError,
		error,
	} = useQuery({
		queryKey: ['bank'],
		queryFn: () => bankService.getBank(),
		retry: false,
	})

	const isBankNotFound =
		isBankGetError &&
		error instanceof FetchError &&
		error.statusCode === 400

	return {
		bank,
		isLoadingBank,
		isBankGetError,
		isBankNotFound,
	}
}
