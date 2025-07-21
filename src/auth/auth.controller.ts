import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignUpDto } from './dto';
import { Response } from 'express';
import { GetUser } from './decorator';
import { UserFromJwt } from 'src/utils/types';
import { JwtGuard } from './guards';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Get('confirm-email/:token')
  confirmAccount(@Param('token') token: string) {
    return this.authService.confirmAccount(token);
  }

  @Post('signin')
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokenInfo = await this.authService.signin(dto);

    res.cookie('access_token', tokenInfo, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 10 * 1000,
    });
    return tokenInfo;
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  getMyProfile(@GetUser() user: UserFromJwt) {
    return user;
  }

  @Post('signout')
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return {
      message: 'signout successfull',
    };
  }
}
