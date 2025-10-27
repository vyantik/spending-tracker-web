'use client'

import { AuthTypeProps } from '.'
import { AuthInput } from '.'
import { type LoginRequest, LoginRequestSchema } from '@hermes/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button, Form, FormField } from '@/shared'

import { useLoginMutation } from '../hooks'

export const Login = ({ router }: AuthTypeProps) => {
	const form = useForm<LoginRequest>({
		resolver: zodResolver(LoginRequestSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const { login, isLoadingLogin } = useLoginMutation(() => {
		form.reset()
	})

	const onSubmit = (values: LoginRequest) => {
		login({ values })
	}

	return (
		<>
			<p className='flex justify-center items-center font-semibold'>
				Вход
			</p>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-2 w-2/3 mx-auto'
				>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<AuthInput
								name='Email'
								type='email'
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								error={form.formState.errors.email?.message}
								disabled={isLoadingLogin}
							/>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<AuthInput
								name='Пароль'
								type='password'
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								error={form.formState.errors.password?.message}
								disabled={isLoadingLogin}
							/>
						)}
					/>
					<div className='flex flex-col justify-center items-center gap-y-2 pt-2'>
						<Button
							variant={'default'}
							className='w-3/4'
							type={'submit'}
							disabled={isLoadingLogin}
						>
							<p className='font-semibold'>Войти</p>
						</Button>
						<Button
							variant={'outline'}
							className='w-3/4'
							onClick={() => router.push('/auth/register')}
							type='button'
						>
							<p className='font-semibold'>Регистрация</p>
						</Button>
					</div>
				</form>
			</Form>
		</>
	)
}
