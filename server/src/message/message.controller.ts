import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('channel/:id')
  async getMessages(@Param('id') channelId: number) {
    return this.messageService.getMessagesInChannel(channelId);
  }
}
