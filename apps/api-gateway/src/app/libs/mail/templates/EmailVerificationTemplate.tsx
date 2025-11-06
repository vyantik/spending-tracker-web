import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from '@react-email/components'
import * as React from 'react'

interface EmailVerificationTemplateProps {
	otpCode: string
}

export const EmailVerificationTemplate = ({
	otpCode,
}: EmailVerificationTemplateProps) => {
	return (
		<Html>
			<Head />
			<Preview>Подтвердите ваш email адрес</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={header}>
						<Heading style={h1}>Подтверждение Email</Heading>
					</Section>
					<Section style={content}>
						<Text style={text}>
							Спасибо за регистрацию! Для завершения регистрации
							необходимо подтвердить ваш email адрес.
						</Text>
						<Text style={text}>
							Используйте следующий код для верификации:
						</Text>
						<Section style={codeContainer}>
							<Text style={code}>{otpCode}</Text>
						</Section>
						<Text style={text}>
							Этот код действителен в течение 10 минут.
						</Text>
						<Hr style={hr} />
						<Text style={footer}>
							Если вы не регистрировались на нашем сайте, просто
							проигнорируйте это письмо.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	)
}

export default EmailVerificationTemplate

const main = {
	backgroundColor: '#f6f9fc',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
	backgroundColor: '#ffffff',
	margin: '0 auto',
	padding: '20px 0 48px',
	marginBottom: '64px',
	borderRadius: '8px',
	boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
	maxWidth: '600px',
}

const header = {
	padding: '32px 48px',
	backgroundColor: '#6366f1',
	borderRadius: '8px 8px 0 0',
}

const h1 = {
	color: '#ffffff',
	fontSize: '28px',
	fontWeight: '700',
	margin: '0',
	textAlign: 'center' as const,
}

const content = {
	padding: '32px 48px',
}

const text = {
	color: '#334155',
	fontSize: '16px',
	lineHeight: '26px',
	margin: '0 0 16px 0',
}

const codeContainer = {
	backgroundColor: '#f1f5f9',
	borderRadius: '8px',
	padding: '24px',
	margin: '24px 0',
	textAlign: 'center' as const,
	border: '2px dashed #cbd5e1',
}

const code = {
	color: '#1e293b',
	fontSize: '32px',
	fontWeight: '700',
	letterSpacing: '8px',
	margin: '0',
	fontFamily: 'monospace',
}

const hr = {
	borderColor: '#e2e8f0',
	margin: '32px 0',
}

const footer = {
	color: '#64748b',
	fontSize: '14px',
	lineHeight: '20px',
	margin: '0',
	textAlign: 'center' as const,
}
