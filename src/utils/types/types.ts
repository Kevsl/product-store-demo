import { Request } from 'express';

export type JwtPayLoad = {
  sub: string;
  role: string;
  name: string;
};

export interface RequestWithCookies extends Request {
  cookies: {
    access_token?: string;
    [key: string]: string | undefined;
  };
}

export interface UserFromJwt {
  id: string;
  name: string;
  email: string;
  role: {
    name: string;
  };
}
