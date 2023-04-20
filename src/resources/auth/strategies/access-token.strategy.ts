import { PrismaService } from '@/resources/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  constructor(config: ConfigService, private readonly prisma: PrismaService) {
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

  async validate(payload: TJwtUser): Promise<TJwtUser> {
    const hasBlockedSession = await this.prisma.session.findFirst({
      where: {
        userId: payload.userId,
        isBlocked: true,
      },
    });
    if (hasBlockedSession)
      throw new UnauthorizedException('Unauthorized: blocked');
    return payload;
  }
}
