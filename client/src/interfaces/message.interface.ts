import { IChannel } from './channel.interface';
import { IUser } from './user.interface';

export interface IMessage {
  id: number;
  sender: IUser;
  channel: IChannel;
  content: string;
}
