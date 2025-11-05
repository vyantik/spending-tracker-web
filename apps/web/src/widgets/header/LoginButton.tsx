import { DoorOpen } from '@public'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import Image from 'next/image'
import type { ReactElement } from 'react'

import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shared'

interface LoginButtonProps {
	router: AppRouterInstance
}

export const LoginButton = ({ router }: LoginButtonProps): ReactElement => {
	return (
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
	)
}
