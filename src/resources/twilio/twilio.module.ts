import { Module } from '@nestjs/common';
import { TwilioModule as TwilioM } from 'nestjs-twilio';
import { TwilioService } from './twilio.service';

@Module({
  imports: [
    TwilioM.forRoot({
      isGlobal: true,
      accountSid: process.env.TWILIO_ACCOUNT_SID as string,
      authToken: process.env.TWILIO_AUTH_TOKEN as string,
    }),
  ],
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwilioModule {}
