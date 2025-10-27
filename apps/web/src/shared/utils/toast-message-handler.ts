import { toast } from 'sonner'

export function toastMessageHandler(error: Error) {
	if (error.message) {
		toast.error(error.message)
	} else {
		toast.error('Ошибка со стороны сервера')
	}
}
