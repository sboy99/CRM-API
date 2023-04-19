import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TJwtUser } from '../../types/jwt-user.type';
import { VerificationTokenPayload } from '../types/verification-token.type';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async generateAuthTokens(payload: TJwtUser): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      }),
      this.jwt.signAsync(payload, {
        expiresIn: '7day',
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  generateVerificationToken(
    payload: VerificationTokenPayload,
  ): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  getDecodedToken(token: string): Promise<VerificationTokenPayload> {
    return this.jwt.verifyAsync(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
