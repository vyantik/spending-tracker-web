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
		<header className='w-screen h-[5vh] bg-linear-65 from-blue-500 to-blue-300 p-4 flex'>
			<div className='mr-auto'>
				<Button variant='outline'>ХУЙ</Button>
			</div>
			<div className='flex justify-center items-center gap-8'>
				<Button variant='outline' onClick={() => router.push('/')}>
					<p className='font-semibold'>Главная</p>
				</Button>
				<TooltipProvider delayDuration={0}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant='outline'
								onClick={() => router.push('/auth')}
							>
								<Image src={DoorOpen} alt='' />
							</Button>
						</TooltipTrigger>
						<TooltipContent side='bottom'>Войти</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</header>
	)
}
