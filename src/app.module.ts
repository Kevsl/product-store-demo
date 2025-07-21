import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ScheduleModule.forRoot(),
    ProductModule,
    ProductCategoryModule,
    AuthModule,
    EmailModule,
    UserModule,
  ],
})
export class AppModule {}
