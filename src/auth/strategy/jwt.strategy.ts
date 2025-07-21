import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayLoad, RequestWithCookies, UserFromJwt } from 'src/utils/types';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const jwtSecret = config.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('Jwt secret is undefined');
    }

    const secret: string = jwtSecret;

    super({
      jwtFromRequest: (req: RequestWithCookies) => {
        if (!req || !req.cookies || !req.cookies['access_token']) {
          return null;
        }
        return req.cookies.access_token;
      },
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayLoad): Promise<UserFromJwt> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
