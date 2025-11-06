import { Header } from '@/widgets'

export default function MainLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='min-h-screen bg-linear-240 from-blue-500 to-blue-300 dark:from-[#0A0A0A] dark:to-[#0a0a0a] flex flex-col'>
			<Header />
			<main className='flex-1'>{children}</main>
		</div>
	)
}
