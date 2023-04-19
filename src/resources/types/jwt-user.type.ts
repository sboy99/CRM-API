import { User } from '@prisma/client';

export type TJwtUser = Pick<User, 'email' | 'role'> & {
  userId: User['id'];
  refreshToken?: string;
};
