'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReactElement } from 'react'

import { Button, ToggleTheme, useProfile } from '@/shared'
import { UserButton, UserButtonLoading } from '@/widgets'

import { LoginButton } from './LoginButton'

export const Header = (): ReactElement => {
	const router = useRouter()
	const { user, isLoadingUser } = useProfile()

	return (
		<header className='sticky top-0 z-50 w-full h-[7vh] p-4 flex items-center justify-between bg-white dark:bg-[#161616] border-b border-gray-200 dark:border-gray-800'>
			<div className='flex items-center gap-4'>
				<button
					onClick={() => router.push('/')}
					className='flex items-center gap-2 hover:opacity-80 transition-opacity'
					aria-label='Главная страница'
				>
					<Image
						src='/icons/logo.svg'
						alt='Hermes Logo'
						width={32}
						height={32}
						className='dark:invert'
					/>
				</button>
			</div>
			<div className='flex justify-center items-center gap-8'>
				<Button variant='default' onClick={() => router.push('/')}>
					<p className='font-semibold'>Главная</p>
				</Button>
				{isLoadingUser ? (
					<UserButtonLoading />
				) : user ? (
					<>
						<Button onClick={() => router.push('/bank')}>
							<p className='font-semibold'>Банк</p>
						</Button>
						<UserButton router={router} />
					</>
				) : (
					<LoginButton router={router} />
				)}
				<ToggleTheme />
			</div>
		</header>
	)
}
