import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { ZodValidationPipe } from 'nestjs-zod'

import { AppModule } from './app/app.module'
import { getCorsConfig, getSwaggerConfig } from './app/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)

	const port = config.getOrThrow<number>('HTTP_PORT')

	app.enableCors(getCorsConfig(config))
	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))
	app.useGlobalPipes(new ZodValidationPipe())
	app.setGlobalPrefix('api/v1')

	const swaggerDocument = SwaggerModule.createDocument(
		app,
		getSwaggerConfig(),
	)
	SwaggerModule.setup('api/v1/docs', app, swaggerDocument, {
		jsonDocumentUrl: 'openapi.json',
	})

	await app.listen(port)
}

bootstrap()
