import { Trim } from '@/transformers/trim.transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendVerificationEmailDto {
  @Trim()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
