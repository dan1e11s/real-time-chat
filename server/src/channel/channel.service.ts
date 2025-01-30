import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelMember } from './entities/channel-member.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,

    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
  ) {}

  async createChannel(name: string, owner: User): Promise<Channel> {
    const channel = this.channelRepository.create({ name, owner });
    const savedChannel = await this.channelRepository.save(channel);

    const member = this.channelMemberRepository.create({
      user: owner,
      channel: savedChannel,
    });
    await this.channelMemberRepository.save(member);

    return savedChannel;
  }

  async joinChannel(channelId: number, user: User): Promise<void> {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['owner'],
    });
    if (!channel) {
      throw new NotFoundException('Канал не найден');
    }
    const existingMember = await this.channelMemberRepository.findOne({
      where: { channel: { id: channelId }, user: { id: user.id } },
    });
    if (!existingMember) {
      const member = this.channelMemberRepository.create({ user, channel });
      await this.channelMemberRepository.save(member);
    }
  }

  async getChannelById(channelId: number): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['owner'],
    });

    if (!channel) {
      throw new NotFoundException('Канал не найден');
    }

    return channel;
  }

  async getChannels(): Promise<Channel[]> {
    return this.channelRepository.find({ relations: ['owner'] });
  }

  async getChannelMembers(channelId: number): Promise<User[]> {
    const members = await this.channelMemberRepository.find({
      where: { channel: { id: channelId } },
      relations: ['user'],
    });
    return members.map((m) => m.user);
  }

  async removeUserFromChannel(
    channelId: number,
    userId: number,
    requester: User,
  ): Promise<void> {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['owner'],
    });
    if (!channel) {
      throw new NotFoundException('Канал не найден');
    }
    // only the channel owner can remove members
    if (channel.owner.id !== requester.id) {
      throw new ForbiddenException('Вы не являетесь владельцем канала');
    }

    const member = await this.channelMemberRepository.findOne({
      where: { channel: { id: channelId }, user: { id: userId } },
      relations: ['user', 'channel'],
    });
    if (!member) {
      throw new NotFoundException('Пользователь не состоит в канале');
    }
    await this.channelMemberRepository.remove(member);
  }
}
