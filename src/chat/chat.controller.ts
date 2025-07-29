import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  async ask(@Body() dto: ChatDto) {
    return this.chatService.ask(dto);
  }
}
