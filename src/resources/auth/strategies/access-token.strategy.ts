import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TJwtUser } from '../../types/jwt-user.type';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'check-access-token',
) {
  constructor(config: ConfigService) {
    super({
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const accessToken = req?.signedCookies['access-token'] as string;
          if (!accessToken) {
            return null;
          }

          return accessToken;
        },
      ]),
    });
  }

  validate(payload: TJwtUser): TJwtUser {
    return payload;
  }
}
