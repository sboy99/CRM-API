import { Module } from '@nestjs/common';
import { PrismaModule } from './resources/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './resources/auth/auth.module';
import { UserModule } from './resources/user/user.module';
import { MailService } from './resources/mail/mail.service';
import { MailModule } from './resources/mail/mail.module';
import { HashModule } from './resources/hash/hash.module';
import { TwilioModule } from './resources/twilio/twilio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MailModule,
    HashModule,
    TwilioModule,
  ],
  controllers: [],
  providers: [MailService],
})
export class AppModule {}
