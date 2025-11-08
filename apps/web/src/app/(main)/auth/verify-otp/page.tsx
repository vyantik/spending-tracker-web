import type { ReactElement } from 'react'

import { Card } from '@/shared/ui'
import { VerifyOtp } from '@/widgets'

export default function VerifyOtpPage(): ReactElement {
	return (
		<div className='w-full h-full flex justify-center items-center p-4'>
			<Card className='w-full max-w-md'>
				<VerifyOtp />
			</Card>
		</div>
	)
}
