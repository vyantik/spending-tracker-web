import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export interface AuthTypeProps {
	router: AppRouterInstance
}

export * from './AuthWrapper'
export * from './AuthInput'
export * from './Register'
export * from './Login'
export * from './VerifyOtp'
