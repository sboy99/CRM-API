import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { AccessTokenGuard } from './guards/token.guard';

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
  login(
    @Body() loginUserDto: LoginUserDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.loginUser(loginUserDto, ip, userAgent);
  }
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @Post('logout')
  logout(@Ip() ip: string, @Headers('user-agent') userAgent: string) {
    return this.authService.logoutUser(ip, userAgent);
  }

  @HttpCode(HttpStatus.OK)
  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
