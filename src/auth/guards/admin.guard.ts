import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserRoles } from 'src/utils/const';
import { UserFromJwt } from 'src/utils/types';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user as UserFromJwt;
    return user.role.name === UserRoles.ADMIN;
  }
}
