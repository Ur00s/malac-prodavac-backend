import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../core/authentication/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthorizableSocket } from '../../core/socket.io';
import cookie from 'cookie';

export const createIoAuthMiddleware =
  (jwtService: JwtService, cookieName: string) =>
  async (client: AuthorizableSocket, next: any) => {
    try {
      const cookies = cookie.parse(client.handshake?.headers?.cookie);
      const payload: JwtPayload = jwtService.verify(cookies[cookieName]);
      client.user = payload.user;
      client.join(client.user.id.toString());
      next();
    } catch {
      next(new UnauthorizedException());
    }
  };
