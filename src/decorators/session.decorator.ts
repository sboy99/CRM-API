import { TJwtUser } from '@/resources/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const SessionId = createParamDecorator(
  (
    data: undefined,
    ctx: ExecutionContext,
  ): TJwtUser | TJwtUser[keyof TJwtUser] => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const sessionId = request?.signedCookies['session-id'];
    return sessionId;
  },
);
