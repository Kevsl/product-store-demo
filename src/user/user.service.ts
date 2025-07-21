import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async notifyGdprWillExpire() {
    const elevenMonthesAgo = new Date();
    elevenMonthesAgo.setMonth(elevenMonthesAgo.getMonth() - 11);

    const users = await this.prisma.user.findMany({
      where: {
        gpdr: {
          lte: elevenMonthesAgo,
        },
      },
    });

    for (const user of users) {
      await this.emailService.youMissedUsSoMuch(user.email);
    }
  }
}
