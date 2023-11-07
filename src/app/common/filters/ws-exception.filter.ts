import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JsonWebTokenError } from 'jsonwebtoken';
@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  constructor(private errorCodeMappings: Record<string, HttpStatus>) {
    super();
  }

  private logger = new Logger(WsExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.log(exception);

    let exceptionResponse: string | object;

    if (exception instanceof HttpException) {
      exceptionResponse = exception.getResponse();
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      const statusCode = this.errorCodeMappings[exception.code];
      const message = `[${exception.code}]: ${this.exceptionShortMessage(
        exception.message,
      )}`;

      exceptionResponse = new HttpException(
        { statusCode, message },
        statusCode,
      ).getResponse();
    }

    if (exception instanceof JsonWebTokenError) {
      exceptionResponse = new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: exception.message,
        name: exception.name,
      }).getResponse();
    }
    exception = new WsException(exceptionResponse);

    super.catch(exception, host);
  }

  exceptionShortMessage(message: string) {
    const shortMessage = message.substring(message.indexOf('→'));
    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }
}
