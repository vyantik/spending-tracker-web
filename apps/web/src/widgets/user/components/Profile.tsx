'use client'

import type { ReactElement } from 'react'

import {
	Button,
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	useProfile,
} from '@/shared'

import { useLogoutMutation } from '../hooks'

import { ProfileInfo } from './ProfileInfo'

export function Profile(): ReactElement {
	const profile = useProfile()

	const { logout } = useLogoutMutation()

	return (
		<div className='flex justify-center items-center w-screen h-screen'>
			<Card className='w-full max-w-sm'>
				<CardHeader>
					<CardTitle>Профиль</CardTitle>
					<CardAction>
						<Button variant='link' onClick={() => logout()}>
							Выход
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<div className='mb-8'>
						{/*TODO: Add ProfileImage and upload avatar */}
					</div>
					<div className='space-y-2'>
						<ProfileInfo
							info={profile.user?.username}
							isLoading={profile.isLoadingUser}
							infoDescribe='Имя пользователя'
						/>
						<ProfileInfo
							info={profile.user?.email}
							isLoading={profile.isLoadingUser}
							infoDescribe='Почта'
						/>
					</div>
				</CardContent>
				<CardFooter className='flex-col gap-2'></CardFooter>
			</Card>
		</div>
	)
}
