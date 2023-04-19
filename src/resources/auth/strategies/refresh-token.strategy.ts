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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: { userId: string; email: string; role: TJwtUser['role'] },
  ): TJwtUser {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      refreshToken,
    };
  }
}
