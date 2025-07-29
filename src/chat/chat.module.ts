import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import OpenAI from 'openai';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [ChatController],
  imports: [ConfigModule],
  providers: [
    ChatService,
    {
      provide: OpenAI,
      useFactory: (config: ConfigService) =>
        new OpenAI({
          apiKey: config.getOrThrow<string>('OPENAI_SECRET'),
        }),
      inject: [ConfigService],
    },
  ],
  exports: [OpenAI, ChatService],
})
export class ChatModule {}
