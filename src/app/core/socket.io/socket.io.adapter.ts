import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppConfig } from '../configuration/app';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { createIoAuthMiddleware } from '../../common/middlewares';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private appContext: INestApplicationContext,
    private appConfig: AppConfig,
    private baseUrl: string,
  ) {
    super(appContext);
  }

  private readonly logger = new Logger(SocketIoAdapter.name);

  createIOServer(port: number, options: any) {
    const jwtService = this.appContext.get(JwtService);
    options.cors = { origin: this.baseUrl };
    const server: Server = super.createIOServer(port, options);
    const ioAuthMiddleware = createIoAuthMiddleware(
      jwtService,
      this.appConfig.auth.cookieName,
    );
    server.use(ioAuthMiddleware);
    server.on('new_namespace', (namespace) => {
      namespace.use(ioAuthMiddleware);
    });
    return server;
  }
}
