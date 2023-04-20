import { TResponse } from '@/resources/types/response.type';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

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

    // filter error  messages
    function getErrorDetails() {
      if (exception instanceof HttpException) {
        const errorRes = exception.getResponse() as any;
        return errorRes.message;
      }

      if (exception instanceof PrismaClientKnownRequestError) {
        console.log(exception.code, 'test');

        if (exception.code === 'P2002') {
          if (exception.meta as any) {
            const violatedFields = exception.meta.target as Array<string>;
            return violatedFields.map(
              (field) => `Another value of field ${field} already exist`,
            );
          }
        }
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
