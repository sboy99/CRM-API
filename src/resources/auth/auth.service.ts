import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HashService } from '../hash/hash.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { TwilioService } from '../twilio/twilio.service';
import { TResponse } from '../types/response.type';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { SessionService } from './session/session.service';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly hashService: HashService,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
    private readonly twilioService: TwilioService,
    private readonly tokenService: TokenService,
  ) {}
  /**
   *
   * @returns response
   */
  async registerUser(registerUserDto: RegisterUserDto): Promise<TResponse> {
    // check if user already registered
    const isUserAlreadyRegistered = await this.prisma.user.findFirst({
      where: {
        email: registerUserDto.email,
      },
    });
    if (isUserAlreadyRegistered)
      throw new BadRequestException('Another user already registered');
    // hash password
    const hashedPassword = await this.hashService.getHash(
      registerUserDto.password,
    );
    // create an user;
    const user = await this.prisma.user.create({
      data: {
        name: registerUserDto.username,
        email: registerUserDto.email,
        password: hashedPassword,
        phone: registerUserDto.phone,
      },
    });
    // generate verification token
    const verificationToken = await this.tokenService.generateVerificationToken(
      {
        userId: user.id,
        email: user.email,
      },
    );
    // send verification email
    await this.mailService.sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationUrl: `${this.configService.get(
        'ORIGIN',
      )}/auth/verify-email?token=${verificationToken}`,
    });

    return {
      message:
        'Registration Successfull!, We have sent you a verification email. Please check your inbox',
      status: 200,
    };
  }
  /**
   *
   * @returns response
   */
  async loginUser(
    loginUserDto: LoginUserDto,
    ip: string,
    userAgent: string,
  ): Promise<
    TResponse<
      unknown,
      {
        accessToken: string;
        refreshToken: string;
      }
    >
  > {
    //  find the user
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) throw new NotFoundException('User does not exist');
    if (!user.isVerified)
      throw new BadRequestException('Please verify your email');
    // compare password
    const isPasswordMatch = await this.hashService.compareHash(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordMatch) throw new BadRequestException('Wrong password');

    // generate auth tokens
    const authTokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    //  create a active session
    await this.sessionService.createSession({
      userId: user.id,
      ip,
      userAgent,
      refreshToken: authTokens.refreshToken,
    });

    return {
      message: 'Login Successfull!',
      status: 200,
      tokens: authTokens,
    };
  }
  /**
   *
   * @returns response
   */
  async logoutUser(ip: string, userAgent: string): Promise<TResponse> {
    return {
      message: 'Logging out user',
      status: 200,
    };
  }

  async verifyEmail(token: string): Promise<TResponse> {
    const payload = await this.tokenService.getDecodedToken(token);
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.userId,
        email: payload.email,
      },
    });
    if (!user) throw new BadRequestException('Verification failed');
    // set verified user
    await this.prisma.user.update({
      where: {
        email: payload.email,
      },
      data: {
        isVerified: true,
      },
    });
    return {
      message: 'Verification Successfull!',
      status: 200,
    };
  }
}
