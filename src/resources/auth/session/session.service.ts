import { HashService } from '@/resources/hash/hash.service';
import { PrismaService } from '@/resources/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { CreateSessionDto } from './dtos/create-session.dto';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
  ) {}
  async createSession(createSessionDto: CreateSessionDto): Promise<Session> {
    const refreshHash = await this.hashService.getHash(
      createSessionDto.refreshToken.split('.')[2],
    );
    const session = await this.prisma.session.upsert({
      where: {
        userId_ip: {
          userId: createSessionDto.userId,
          ip: createSessionDto.ip,
        },
      },
      create: {
        ip: createSessionDto.ip,
        userAgent: createSessionDto.userAgent,
        userId: createSessionDto.userId,
        refreshHash,
      },
      update: {
        userAgent: createSessionDto.userAgent,
        refreshHash,
      },
    });
    return session;
  }
}
