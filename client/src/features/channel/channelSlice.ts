import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getChannelInfo,
  getChannelMembers,
  getChannelMessages,
  getChannels,
} from './requests';

import { IChannel } from '../../interfaces/channel.interface';
import { IMessage } from './../../interfaces/message.interface';
import { IUser } from '../../interfaces/user.interface';

interface IInitialState {
  channels: IChannel[];
  channelInfo: IChannel | null;
  channelMessages: IMessage[];
  channelMembers: IUser[];
}

const initialState: IInitialState = {
  channels: [],
  channelInfo: null,
  channelMessages: [],
  channelMembers: [],
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.channelMessages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChannels.fulfilled, (state, action) => {
        state.channels = action.payload;
      })
      .addCase(getChannelInfo.fulfilled, (state, action) => {
        state.channelInfo = action.payload;
      })
      .addCase(getChannelMessages.fulfilled, (state, action) => {
        state.channelMessages = action.payload;
      })
      .addCase(getChannelMembers.fulfilled, (state, action) => {
        state.channelMembers = action.payload;
      });
  },
});

export const { setMessages } = channelsSlice.actions;
export default channelsSlice.reducer;
