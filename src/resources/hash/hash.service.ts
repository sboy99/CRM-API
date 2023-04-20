import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashService {
  async getHash(key: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(key, salt);
  }

  async compareHash(key: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(key, hash);
  }
}
