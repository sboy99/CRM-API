import { Injectable } from '@nestjs/common';
import { TwilioService as Twilio } from 'nestjs-twilio';
import { PrismaService } from '../prisma/prisma.service';
import { SendSmsDto } from './dto/send-sms.dto';

@Injectable()
export class TwilioService {
  constructor(
    private readonly twilio: Twilio,
    private readonly prisma: PrismaService,
  ) {}

  async sendSMS(sendSmsDto: SendSmsDto) {
    return this.twilio.client.messages.create({
      to: '+12316851234',
      from: '+15555555555',
      body: sendSmsDto.body,
    });
  }

  async sendVerificationCodeSMS(to: string) {
    // create a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    // sync the verification code with the database
    const expirationDate = new Date(
      new Date(Date.now()).setMinutes(new Date(Date.now()).getMinutes() + 5),
    );
    // create a otp verification
    await this.prisma.otp.create({
      data: {
        phone: to,
        otp: verificationCode.toString(),
        expirationDate,
      },
    });

    // send the verification code to the user
    const body = `Welcome to CRM API, Here's your verification code: ${verificationCode}`;
    return this.sendSMS({
      to,
      body,
    });
  }
}
