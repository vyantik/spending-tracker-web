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
} from '@/shared'

export const Header = (): ReactElement => {
	const router = useRouter()

	return (
		<header className='w-screen h-[5vh] bg-linear-240 from-blue-500 to-blue-300 dark:from-[#0A0A0A] dark:to-[#0a0a0a] p-4 flex'>
			<div className='mr-auto'>
				<Button variant='default'>ХУЙ</Button>
			</div>
			<div className='flex justify-center items-center gap-8'>
				<Button variant='default' onClick={() => router.push('/')}>
					<p className='font-semibold'>Главная</p>
				</Button>
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
			</div>
		</header>
	)
}
