import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  // todo: implement request information
  login(@Body() loginUserDto: LoginUserDto, @Ip() ip: string) {
    return this.authService.loginUser(loginUserDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout() {
    return this.authService.logoutUser();
  }
}
