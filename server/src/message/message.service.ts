import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { UserService } from '../user/user.service';
import { ChannelService } from '../channel/channel.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UserService,
    private channelService: ChannelService,
  ) {}

  async createMessage(
    userId: number,
    channelId: number,
    content: string,
  ): Promise<Message> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('Пользователь не найден');

    const channels = await this.channelService.getChannels();
    const channel = channels.find((ch) => ch.id === channelId);
    if (!channel) throw new NotFoundException('Канал не найден');

    const message = this.messageRepository.create({
      sender: user,
      channel,
      content,
    });
    return this.messageRepository.save(message);
  }

  async getMessagesInChannel(channelId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { channel: { id: channelId } },
      relations: ['sender', 'channel'],
      order: { createdAt: 'ASC' },
    });
  }
}
