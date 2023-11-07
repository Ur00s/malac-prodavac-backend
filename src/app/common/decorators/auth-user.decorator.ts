import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JWTPayloadUser;
  },
);
