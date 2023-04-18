import { PrismaService } from '@/resources/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { CreateSessionDto } from './dtos/create-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}
  async createSession(createSessionDto: CreateSessionDto): Promise<Session> {
    // todo: hash refresh function
    const session = await this.prisma.session.create({
      data: {
        ip: createSessionDto.ip,
        userAgent: createSessionDto.userAgent,
        userId: createSessionDto.userId,
        refreshHash: createSessionDto.refreshToken,
      },
    });
    return session;
  }
}
