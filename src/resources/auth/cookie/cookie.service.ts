import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}
  createCookie(res: Response, name: string, value: string, exp: number) {
    res.cookie(name, value, {
      httpOnly: true,
      expires: new Date(Date.now() + exp),
      secure: this.configService.get('NODE_ENV') === 'production',
      signed: true,
    });
  }
}
