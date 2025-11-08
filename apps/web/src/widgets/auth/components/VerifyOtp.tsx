'use client'

import { AuthInput } from '.'
import {
	type VerifyOtpRequest,
	VerifyOtpRequestSchema,
} from '@hermes/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button, Form, FormField } from '@/shared'

import { useVerifyOtpMutation } from '../hooks'

export const VerifyOtp = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const email = searchParams.get('email') || ''

	const form = useForm<VerifyOtpRequest>({
		resolver: zodResolver(VerifyOtpRequestSchema),
		defaultValues: {
			email: email,
			code: '',
		},
	})

	const { verifyOtp, isLoadingVerify } = useVerifyOtpMutation(() => {
		form.reset()
	})

	const onSubmit = (values: VerifyOtpRequest) => {
		verifyOtp({ values })
	}

	return (
		<>
			<p className='flex justify-center items-center font-semibold'>
				Подтверждение Email
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
								disabled={isLoadingVerify || !!email}
							/>
						)}
					/>
					<FormField
						control={form.control}
						name='code'
						render={({ field }) => (
							<AuthInput
								name='Код подтверждения'
								type='text'
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								error={form.formState.errors.code?.message}
								disabled={isLoadingVerify}
								maxLength={6}
							/>
						)}
					/>
					<div className='flex flex-col justify-center items-center gap-y-2 pt-2'>
						<Button
							variant={'default'}
							className='w-3/4'
							type={'submit'}
							disabled={isLoadingVerify}
						>
							<p className='font-semibold'>Подтвердить</p>
						</Button>
						<Button
							variant={'outline'}
							className='w-3/4'
							onClick={() => router.push('/auth/login')}
							type='button'
							disabled={isLoadingVerify}
						>
							<p className='font-semibold'>Вход</p>
						</Button>
					</div>
				</form>
			</Form>
		</>
	)
}
