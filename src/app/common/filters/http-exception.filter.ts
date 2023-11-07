import { Catch, HttpException, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor() {
    super();
  }

  private logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.log(exception);
    super.catch(exception, host);
  }
}
