import { Header } from '@/widgets'

export default function MainLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Header />
			{children}
		</>
	)
}
