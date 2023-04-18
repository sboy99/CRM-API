import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HashService } from '../hash/hash.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { SessionService } from './session/session.service';
import { TResponse } from './types/response.type';
import { TwilioService } from '../twilio/twilio.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly hashService: HashService,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
    private readonly twilioService: TwilioService,
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
    if (user.phone) {
      // send verification code
      await this.twilioService.sendVerificationCodeSMS(user.phone);
    } else {
      // send verification email
      await this.mailService.sendVerificationEmail({
        to: user.email,
        name: user.name,
        callbaclUrl: `test`,
      });
    }

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
  async loginUser(loginUserDto: LoginUserDto): Promise<TResponse> {
    //  find the user
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) throw new NotFoundException('User does not exist');
    // compare password
    const isPasswordMatch = await this.hashService.compareHash(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordMatch) throw new BadRequestException('Wrong password');
    //todo: create a active session
    // const session = await this.sessionService.createSession({
    //   userId: user.id,
    //   ip:
    // });

    return {
      message: 'Login Successfull!',
      status: 200,
    };
  }
  /**
   *
   * @returns response
   */
  async logoutUser(): Promise<TResponse> {
    return {
      message: 'Logging out user',
      status: 200,
    };
  }
}
