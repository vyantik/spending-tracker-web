'use client'

import { useRouter } from 'next/navigation'
import type { ReactElement } from 'react'

import { Card } from '@/shared'

import { Login } from './Login'
import { Register } from './Register'

interface AuthWrapperProps {
	type: 'login' | 'register'
}

export const AuthWrapper = ({ type }: AuthWrapperProps): ReactElement => {
	const router = useRouter()

	return (
		<div className='w-full h-full flex justify-center items-center p-4'>
			<Card className='w-full max-w-md'>
				{type === 'login' ? (
					<Login router={router} />
				) : (
					<Register router={router} />
				)}
			</Card>
		</div>
	)
}
