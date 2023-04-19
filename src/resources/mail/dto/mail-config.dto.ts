import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MailConfigDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  verificationUrl: string;
}
