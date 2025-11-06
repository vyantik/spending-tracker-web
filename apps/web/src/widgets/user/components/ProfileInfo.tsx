import type { ReactElement } from 'react'

import { Skeleton } from '@/shared'

interface ProfileInfoProps {
	isLoading: boolean
	info: string | undefined
	infoDescribe: string
}

export function ProfileInfo({
	infoDescribe,
	info,
	isLoading,
}: ProfileInfoProps): ReactElement {
	return (
		<>
			<p className='font-bold'>{infoDescribe}</p>
			{isLoading ? (
				<Skeleton className='p-4' />
			) : (
				<div className='bg-gray-200 dark:bg-gray-900 rounded-2xl'>
					<p className='p-2'>{info}</p>
				</div>
			)}
		</>
	)
}
