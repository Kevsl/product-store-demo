import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserFromJwt } from 'src/utils/types';

export const GetUser = createParamDecorator(
  (data: keyof UserFromJwt, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserFromJwt;

    return data ? user[data] : user;
  },
);
