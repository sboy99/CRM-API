import { Module } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { TwilioService } from '../twilio/twilio.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionService } from './session/session.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MailService, TwilioService, SessionService],
})
export class AuthModule {}
