'use client'

import {
	ArrowRight,
	Banknote,
	BarChart3,
	FileSpreadsheet,
	Users,
	Wallet,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ReactElement } from 'react'

import {
	Button,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	useProfile,
} from '@/shared'

export default function MainPage(): ReactElement {
	const router = useRouter()
	const { user, isLoadingUser } = useProfile()

	const features = [
		{
			icon: Wallet,
			title: 'Управление транзакциями',
			description:
				'Отслеживайте все ваши доходы и расходы в одном месте. Добавляйте транзакции с категориями и описаниями.',
		},
		{
			icon: BarChart3,
			title: 'Статистика и аналитика',
			description:
				'Получайте детальную статистику по вашим транзакциям. Анализируйте расходы по категориям и типам доходов.',
		},
		{
			icon: Users,
			title: 'Совместный банк',
			description:
				'Создавайте банк и приглашайте других пользователей. Управляйте финансами вместе с командой.',
		},
		{
			icon: FileSpreadsheet,
			title: 'Экспорт данных',
			description:
				'Экспортируйте статистику транзакций в Excel для дальнейшего анализа и отчетности.',
		},
	]

	return (
		<div className='w-full h-full overflow-y-auto'>
			<div className='flex flex-col items-center justify-center w-full min-h-full p-4 sm:p-8'>
				{/* Hero Section */}
				<div className='flex flex-col items-center justify-center w-full max-w-4xl gap-6 sm:gap-8 text-center mb-8 sm:mb-12'>
					<div className='flex items-center justify-center gap-3 mb-4'>
						<svg
							width='64'
							height='64'
							viewBox='0 0 32 32'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							className='text-foreground'
						>
							<path
								d='M16 4L4 12V20L16 28L28 20V12L16 4Z'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M12 12L16 20L20 12'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
						<h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold'>
							Vylos
						</h1>
					</div>
					<p className='text-lg sm:text-xl text-black dark:text-muted-foreground max-w-2xl'>
						Управляйте своими финансами эффективно. Отслеживайте
						транзакции, анализируйте расходы и работайте вместе с
						командой.
					</p>
					{!isLoadingUser && !user && (
						<div className='flex flex-col sm:flex-row gap-4 mt-4'>
							<Button
								size='lg'
								onClick={() => router.push('/auth/register')}
								className='text-base px-6 py-6'
							>
								Начать работу
								<ArrowRight className='ml-2 size-5' />
							</Button>
							<Button
								size='lg'
								variant='outline'
								onClick={() => router.push('/auth/login')}
								className='text-base px-6 py-6'
							>
								Войти
							</Button>
						</div>
					)}
					{!isLoadingUser && user && (
						<div className='flex flex-col sm:flex-row gap-4 mt-4'>
							<Button
								size='lg'
								onClick={() => router.push('/bank')}
								className='text-base px-6 py-6'
							>
								<Banknote className='mr-2 size-5' />
								Перейти к банку
							</Button>
							<Button
								size='lg'
								variant='outline'
								onClick={() => router.push('/profile')}
								className='text-base px-6 py-6'
							>
								Профиль
							</Button>
						</div>
					)}
				</div>

				{/* Features Section */}
				<div className='w-full max-w-6xl'>
					<h2 className='text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8'>
						Возможности
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
						{features.map((feature, index) => {
							const Icon = feature.icon
							return (
								<Card
									key={index}
									className='hover:shadow-lg transition-shadow'
								>
									<CardHeader>
										<div className='flex items-center gap-3 mb-2'>
											<div className='p-2 rounded-lg bg-primary/10'>
												<Icon className='size-6 text-primary' />
											</div>
											<CardTitle className='text-xl'>
												{feature.title}
											</CardTitle>
										</div>
										<CardDescription className='text-base'>
											{feature.description}
										</CardDescription>
									</CardHeader>
								</Card>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}
