import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailService } from 'src/email/email.service';
import { UserCron } from './cron/user.cron';

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService, UserCron],
})
export class UserModule {}
