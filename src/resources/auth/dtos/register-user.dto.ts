import { Trim } from '@/transformers/trim.transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @Trim()
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Trim()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Trim()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 0,
    minSymbols: 0,
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber('IN')
  @IsString()
  @IsNotEmpty()
  phone: string;
}
