import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { TwilioService } from '../twilio/twilio.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionService } from './session/session.service';
import {
  AccessTokenStrategy,
  JwtCookieStrategy,
  RefreshTokenStrategy,
} from './strategies';
import { TokenService } from './token/token.service';
import { CookieService } from './cookie/cookie.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    TwilioService,
    SessionService,
    TokenService,
    JwtService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtCookieStrategy,
    CookieService,
  ],
})
export class AuthModule {}
