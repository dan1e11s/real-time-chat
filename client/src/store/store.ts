import { configureStore } from '@reduxjs/toolkit';

// reducers
import userReducer from '../features/user/userSlice';
import channelsReducer from '../features/channel/channelSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    channels: channelsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
