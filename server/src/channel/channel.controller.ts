import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import { UserService } from '../user/user.service';

@Controller('channels')
@UseGuards(JwtAuthGuard)
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private userService: UserService,
  ) {}

  @Get(':id')
  async getChannelById(@Param('id', ParseIntPipe) id: number) {
    return await this.channelService.getChannelById(id);
  }

  @Post('create')
  async createChannel(@Body() dto: { name: string }, @Req() req: Request) {
    const ownerId = (req.user as any).userId;
    const owner = await this.userService.findById(ownerId);
    return this.channelService.createChannel(dto.name, owner);
  }

  @Get()
  async getChannels() {
    return this.channelService.getChannels();
  }

  @Post(':id/join')
  async joinChannel(@Param('id') id: number, @Req() req: Request) {
    const userId = (req.user as any).userId;
    const user = await this.userService.findById(userId);
    return this.channelService.joinChannel(id, user);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: number) {
    return this.channelService.getChannelMembers(id);
  }

  @Delete(':channelId/remove/:userId')
  async removeUser(
    @Param('channelId') channelId: number,
    @Param('userId') userId: number,
    @Req() req: Request,
  ) {
    const requesterId = (req.user as any).userId;
    const requester = await this.userService.findById(requesterId);
    return this.channelService.removeUserFromChannel(
      channelId,
      userId,
      requester,
    );
  }
}
