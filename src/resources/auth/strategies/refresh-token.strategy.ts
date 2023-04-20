import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TJwtUser } from '../../types/jwt-user.type';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'check-refresh-token',
) {
  constructor(config: ConfigService) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const refreshToken = req?.signedCookies['refresh-token'] as string;
          if (!refreshToken) {
            return null;
          }
          return refreshToken;
        },
      ]),
    });
  }

  validate(req: Request, payload: TJwtUser): TJwtUser {
    const refreshToken = req?.signedCookies['refresh-token'] as string;
    const sessionId = req?.signedCookies['session-id'] as string;
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      refreshToken,
      sessionId,
    };
  }
}
