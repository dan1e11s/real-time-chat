import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessageService } from './message.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: true })
export class MessageGateway {
  @WebSocketServer()
  server;

  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { token: string; channelId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');

      const decoded = this.jwtService.verify(data.token, { secret });
      const userId = decoded.sub;
      const message = await this.messageService.createMessage(
        userId,
        data.channelId,
        data.content,
      );

      this.server
        .to(`channel_${data.channelId}`)
        .emit('messageReceived', message);
    } catch (error) {
      console.log(error);
      client.emit('error', { message: 'Ошибка при отправке сообщения' });
    }
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @MessageBody() data: { channelId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`channel_${data.channelId}`);
    client.emit('joinedChannel', { channelId: data.channelId });
  }
}
