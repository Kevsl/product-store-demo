import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from '../user.service';

@Injectable()
export class UserCron {
  constructor(private userService: UserService) {}

  @Cron('* * 8 1 12 *')
  notifyUsersGdprWillExpire() {
    return this.userService.notifyGdprWillExpire();
  }
}
