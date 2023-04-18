import { TResponse } from '@/resources/auth/types/response.type';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    function getErrorDetails() {
      if (exception instanceof HttpException) {
        const errorRes = exception.getResponse() as any;
        return errorRes.message;
      }
      return 'Something went wrong';
    }
    const message = getErrorDetails();
    let error: unknown = {};
    if (exception instanceof HttpException) {
      error = exception.getResponse();
      if (typeof error === 'string') {
        error = {
          error,
        };
      }
    }
    const responseBody: TResponse & { error: unknown } = {
      status: httpStatus,
      message: message,
      error: error,
    };

    console.log(exception);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
