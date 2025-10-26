import { DocumentBuilder } from '@nestjs/swagger'

export function getSwaggerConfig() {
	return new DocumentBuilder()
		.setTitle('hermes API')
		.setDescription(
			'hermes API gives you access to all the features of hermes',
		)
		.setVersion(process.env.npm_package_version ?? '1.0.0')
		.addBearerAuth()
		.build()
}
