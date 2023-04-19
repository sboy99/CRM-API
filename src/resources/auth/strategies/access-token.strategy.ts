import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TJwtUser } from '../../types/jwt-user.type';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'check-access-token',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: {
    userId: string;
    email: string;
    role: TJwtUser['role'];
  }): TJwtUser {
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  }
}
