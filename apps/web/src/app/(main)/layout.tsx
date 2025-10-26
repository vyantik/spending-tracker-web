import { Header } from '@/widgets'

export default function MainLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body>
				<Header />
				{children}
			</body>
		</html>
	)
}
