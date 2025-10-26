import type { ReactElement } from 'react'

import { Card } from '@/shared'

import { AuthInput } from './AuthInput'

export const Auth = (): ReactElement => {
	return (
		<div className='w-screen h-[95vh] flex justify-center items-center'>
			<Card className='w-1/4'>
				<div className='p-6 flex flex-col gap-y-8'>
					<AuthInput name='Почта' type='email' />
					<AuthInput name='Пароль' type='password' />
				</div>
			</Card>
		</div>
	)
}
