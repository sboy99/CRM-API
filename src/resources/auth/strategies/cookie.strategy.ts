import { HashService } from '@/resources/hash/hash.service';
import { PrismaService } from '@/resources/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TJwtUser } from '../../types/jwt-user.type';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
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

  async validate(req: Request, payload?: TJwtUser): Promise<TJwtUser> {
    if (payload) return payload;
    // if access token has expired
    const refreshToken = req?.signedCookies['refresh-token'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('Session Expired!, please re-login');
    }
    // check for authentic refresh token
    const sessionId = req?.signedCookies['session'];

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  }
}
