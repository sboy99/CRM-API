import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailConfigDto } from './dto/mail-config.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(config: ISendMailOptions) {
    return this.mailerService.sendMail(config);
  }

  async sendVerificationEmail(mailConfigDto: MailConfigDto) {
    const subject = 'Welcome to Nice App! Confirm your Email';
    return this.sendMail({
      to: mailConfigDto.to,
      subject,
      template: './conformation',
      context: {
        name: mailConfigDto.name,
        url: mailConfigDto.verificationUrl,
      },
    });
  }
}
