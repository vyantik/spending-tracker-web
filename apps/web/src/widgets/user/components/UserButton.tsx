'use client'

import { LucideBaby, LucideLogOut } from 'lucide-react'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import type { ReactElement } from 'react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Skeleton,
	useProfile,
} from '@/shared'

import { useLogoutMutation } from '../hooks'

interface UserButtonProps {
	router: AppRouterInstance
}
export function UserButton({ router }: UserButtonProps): ReactElement | null {
	const { user } = useProfile()
	const { logout, isLoadingLogout } = useLogoutMutation()

	if (!user) return null

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar key={user.avatar} className='size-12'>
					<AvatarImage
						src={user.avatar || undefined}
						alt={user.username}
					/>
					<AvatarFallback>
						{user.username.slice(0, 1).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-40' align='end'>
				<DropdownMenuItem
					disabled={isLoadingLogout}
					onClick={() => router.push('profile')}
				>
					<LucideBaby className='mr-2 size-4' />
					Профиль
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={isLoadingLogout}
					onClick={() => logout()}
				>
					<LucideLogOut className='mr-2 size-4' />
					Выйти
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export function UserButtonLoading() {
	return <Skeleton className='h-12 w-12 rounded-full' />
}
