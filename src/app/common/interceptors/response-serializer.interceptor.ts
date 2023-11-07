import {
  CallHandler,
  ClassSerializerInterceptor,
  ClassSerializerInterceptorOptions,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NO_AUTO_SERIALIZE } from '../decorators';

@Injectable()
export class ResponseSerializerInterceptor extends ClassSerializerInterceptor {
  constructor(
    readonly reflector: Reflector,
    readonly options: ClassSerializerInterceptorOptions,
  ) {
    super(reflector, options);
  }

  public intercept(context: ExecutionContext, next: CallHandler) {
    const noAutoSerialize = this.reflector.getAllAndOverride<boolean>(
      NO_AUTO_SERIALIZE,
      [context.getHandler(), context.getClass()],
    );

    if (noAutoSerialize) {
      return next.handle();
    }

    return super.intercept(context, next);
  }
}
