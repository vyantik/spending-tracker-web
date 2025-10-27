'use client'

import { DoorOpen } from '@public'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReactElement } from 'react'

import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	useProfile,
} from '@/shared'
import { UserButton, UserButtonLoading } from '@/widgets'

export const Header = (): ReactElement => {
	const router = useRouter()
	const { user, isLoadingUser } = useProfile()

	return (
		<header className='absolute top-0 left-0 w-screen h-[5vh] p-4 flex bg-white dark:bg-[#161616]'>
			<div className='mr-auto'>
				<Button variant='default'>ХУЙ</Button>
			</div>
			<div className='flex justify-center items-center gap-8'>
				<Button variant='default' onClick={() => router.push('/')}>
					<p className='font-semibold'>Главная</p>
				</Button>
				{isLoadingUser ? (
					<UserButtonLoading />
				) : user ? (
					<UserButton />
				) : (
					<TooltipProvider delayDuration={0}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant='default'
									onClick={() => router.push('/auth/login')}
								>
									<Image
										src={DoorOpen}
										alt=''
										className='invert dark:invert-0'
									/>
								</Button>
							</TooltipTrigger>
							<TooltipContent side='bottom'>Войти</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		</header>
	)
}
