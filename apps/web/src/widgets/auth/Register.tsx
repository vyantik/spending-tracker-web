'use client'

import { AuthTypeProps } from '.'

import { Button } from '@/shared'

import { AuthInput } from './AuthInput'

export const Register = ({ router }: AuthTypeProps) => {
	return (
		<>
			<p className='flex justify-center items-center font-semibold'>
				Регистрация
			</p>
			<div className='p-6 flex flex-col gap-y-8 items-center'>
				<AuthInput name='Почта' type='email' />
				<AuthInput name='Пароль' type='password' />
			</div>
			<div className='flex flex-col justify-center items-center gap-y-2'>
				<Button variant={'default'} className='w-3/4'>
					<p className='font-semibold'>Зарегистрироваться</p>
				</Button>
				<Button
					variant={'outline'}
					className='w-3/4'
					onClick={() => router.push('/auth/login')}
				>
					<p className='font-semibold'>Вход</p>
				</Button>
			</div>
		</>
	)
}
