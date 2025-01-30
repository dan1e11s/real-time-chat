import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

import { IChannel } from '../../interfaces/channel.interface';
import { IMessage } from '../../interfaces/message.interface';
import { IUser } from '../../interfaces/user.interface';

export const getChannels = createAsyncThunk<IChannel[]>(
  'channels',
  async () => {
    return (await api.get('/channels')).data;
  }
);

export const getChannelInfo = createAsyncThunk<IChannel, string>(
  'channel-info',
  async (channelId) => {
    return (await api.get(`/channels/${channelId}`)).data;
  }
);

export const channelCreate = createAsyncThunk<void, { name: string }>(
  'channel/create',
  async ({ name }) => {
    await api.post('/channels/create', { name });
  }
);

export const channelJoin = createAsyncThunk<void, number>(
  'channel/join',
  async (channelId) => {
    await api.post(`/channels/${channelId}/join`);
  }
);

export const getChannelMessages = createAsyncThunk<IMessage[], string>(
  'get-messages',
  async (channelId) => {
    const { data } = await api.get(`/messages/channel/${channelId}`);
    return data;
  }
);

export const getChannelMembers = createAsyncThunk<IUser[], string>(
  'get-members',
  async (channelId) => {
    const { data } = await api.get(`/channels/${channelId}/members`);
    return data;
  }
);
