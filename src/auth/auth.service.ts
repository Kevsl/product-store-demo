import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SigninDto, SignUpDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { UserRoles } from 'src/utils/const';
import { EmailService } from 'src/email/email.service';
import { JwtPayLoad } from 'src/utils/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignUpDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser && existingUser.id) {
      throw new BadRequestException('Problem with your credentials');
    }

    const hashedPassword = await argon.hash(dto.password);

    const userRole = await this.prisma.role.findUnique({
      where: {
        name: UserRoles.USER,
      },
    });

    if (!userRole) {
      throw new Error('User role not found');
    }
    const randomToken = Math.floor(Math.random() * 1000000).toString();

    const newUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        isActive: false,
        roleId: userRole.id,
        token: randomToken,
      },
    });

    return this.emailService.sendConfirmation(randomToken, newUser.email);
  }

  async confirmAccount(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        token,
      },
    });

    if (!user || !user.id) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isActive: true,
        token: null,
      },
    });
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
      },
    });

    if (!user || !user.id) {
      throw new NotFoundException('Problem with your credential');
    }

    const passwordMatches = await argon.verify(user.password, dto.password);

    if (!passwordMatches) {
      throw new BadRequestException('Problem with your credentials');
    }
    user.password = '';
    return this.generateToken(user.id, user.role.name, user.name);
  }

  generateToken(userId: string, userRole: string, name: string) {
    const payload: JwtPayLoad = {
      sub: userId,
      role: userRole,
      name,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
    });
    return token;
  }
}
