import { SessionId } from '@/decorators';
import { User } from '@/decorators/user.decorator';
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
  Response,
  UseGuards,
} from '@nestjs/common';
import { Response as IResponse } from 'express';
import { TJwtUser } from '../types';
import { AuthService } from './auth.service';
import { CookieService } from './cookie/cookie.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { ResendVerificationEmailDto } from './dtos/resend-verification-mail.dto';
import { JwtCookieGuard, RefreshTokenGuard } from './guards';

@Controller('auth')
export class AuthController {
  private _15min: number = 15 * 60 * 1000;
  private _3days: number = 3 * 24 * this._15min * 4;
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}
  /**
   *
   * @param registerUserDto RegisterUserDto
   * @returns response
   */
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }
  /**
   *
   * @param res Response
   * @param loginUserDto LoginUserDto
   * @param ip string
   * @param userAgent string
   * @returns response
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Response({ passthrough: true }) res: IResponse,
    @Body() loginUserDto: LoginUserDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.authService.loginUser(
      loginUserDto,
      ip,
      userAgent,
    );
    this.cookieService.createCookie(
      res,
      'access-token',
      result.tokens.accessToken,
      this._15min,
    );
    this.cookieService.createCookie(
      res,
      'refresh-token',
      result.tokens.refreshToken,
      this._3days,
    );
    this.cookieService.createCookie(
      res,
      'session-id',
      result.tokens.sessionId,
      this._3days,
    );
    return result;
  }
  /**
   *
   * @param res Response
   * @param sessionId Session ID
   * @param userId user ID
   * @returns response
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtCookieGuard)
  @Post('logout')
  logout(
    @Response({ passthrough: true }) res: IResponse,
    @SessionId() sessionId: string,
    @User('userId') userId: string,
  ) {
    this.cookieService.deleteCookies(res, [
      'access-token',
      'refresh-token',
      'session-id',
    ]);
    return this.authService.logoutCurrentSession(userId, sessionId);
  }
  /**
   *
   * @param resendVerificationEmailDto ResendVerificationEmailDto
   * @returns response
   */
  @HttpCode(HttpStatus.OK)
  @Post('resend-verification-mail')
  async resendVerificationEmail(
    @Body() resendVerificationEmailDto: ResendVerificationEmailDto,
  ) {
    return this.authService.resendVerificationEmail(resendVerificationEmailDto);
  }
  /**
   *
   * @param token string
   * @returns response
   */
  @HttpCode(HttpStatus.OK)
  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
  /**
   *
   * @param res Express Response
   * @param user user payload
   * @param ip user ip address
   * @param userAgent user's browser agent
   * @returns response
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(
    @Response({ passthrough: true }) res: IResponse,
    @User() user: TJwtUser,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.authService.refreshToken(user, ip, userAgent);
    this.cookieService.createCookie(
      res,
      'access-token',
      result.tokens.accessToken,
      this._15min,
    );
    this.cookieService.createCookie(
      res,
      'refresh-token',
      result.tokens.refreshToken,
      this._3days,
    );
    this.cookieService.createCookie(
      res,
      'session-id',
      result.tokens.sessionId,
      this._3days,
    );
    return result;
  }
}
