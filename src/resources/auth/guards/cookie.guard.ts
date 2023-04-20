import { AuthGuard } from '@nestjs/passport';

export class JwtCookieGuard extends AuthGuard('jwt-cookie') {
  constructor() {
    super();
  }
}
