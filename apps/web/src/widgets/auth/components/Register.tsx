'use client'

import { AuthTypeProps } from '.'
import { AuthInput } from '.'
import { type RegisterRequest, RegisterRequestSchema } from '@hermes/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button, Form, FormField } from '@/shared'

import { useRegisterMutation } from '../hooks'

export const Register = ({ router }: AuthTypeProps) => {
	const form = useForm<RegisterRequest>({
		resolver: zodResolver(RegisterRequestSchema),
		defaultValues: {
			email: '',
			password: '',
			username: '',
			passwordRepeat: '',
		},
	})

	const { register, isLoadingRegister } = useRegisterMutation(() => {
		form.reset()
	})

	const onSubmit = (values: RegisterRequest) => {
		register({ values })
	}

	return (
		<>
			<p className='flex justify-center items-center font-semibold'>
				Регистрация
			</p>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-2 w-2/3 mx-auto'
				>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<AuthInput
								name='Имя пользователя'
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								error={form.formState.errors.username?.message}
								disabled={isLoadingRegister}
							/>
						)}
					/>
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
								disabled={isLoadingRegister}
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
								disabled={isLoadingRegister}
							/>
						)}
					/>
					<FormField
						control={form.control}
						name='passwordRepeat'
						render={({ field }) => (
							<AuthInput
								name='Повторите пароль'
								type='password'
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								error={
									form.formState.errors.passwordRepeat
										?.message
								}
								disabled={isLoadingRegister}
							/>
						)}
					/>
					<div className='flex flex-col justify-center items-center gap-y-2 pt-2'>
						<Button
							variant={'default'}
							className='w-3/4'
							type={'submit'}
							disabled={isLoadingRegister}
						>
							<p className='font-semibold'>Зарегистрироваться</p>
						</Button>
						<Button
							variant={'outline'}
							className='w-3/4'
							onClick={() => router.push('/auth/login')}
							type='button'
						>
							<p className='font-semibold'>Вход</p>
						</Button>
					</div>
				</form>
			</Form>
		</>
	)
}
