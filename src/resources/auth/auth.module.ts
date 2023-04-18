import { Module } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionService } from './session/session.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MailService, SessionService],
})
export class AuthModule {}
