import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app/app.module';
import { loggerOptions } from './util/definition';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { baseUrlFactory } from './util/factory';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app/core/configuration/app';
import metadata from './metadata';
import { SocketIoAdapter } from './app/core/socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerOptions),
  });

  app.enableShutdownHooks();

  const config = app.get(ConfigService);
  const appConfig = config.get<AppConfig>('app');

  await SwaggerModule.loadPluginMetadata(metadata);

  const documentBuilder = new DocumentBuilder()
    .setTitle('Malac Prodavac')
    .setDescription('Malac Prodavac platform API documentation.')
    .setVersion('0.1')
    .addCookieAuth(appConfig.auth.cookieName)
    .setExternalDoc('Malac Prodavac Collection', '/api-json')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder, {});
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
    }),
  );

  app.use(helmet());

  const baseUrl = baseUrlFactory(
    appConfig.protocol,
    undefined,
    appConfig.baseDomain,
  );

  app.enableCors({
    origin: baseUrl,
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Content-Type',
      'Content-Length',
      'Origin',
      'X-Powered-By',
      'X-Requested-With',
      'Authorization',
    ],
  });

  app.useWebSocketAdapter(new SocketIoAdapter(app, appConfig, baseUrl));
  await app.listen(3000);
}
bootstrap();
