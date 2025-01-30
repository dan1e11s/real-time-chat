import { createSlice } from '@reduxjs/toolkit';
import { IUser } from './../../interfaces/user.interface';
import { getUser, searchUsers } from './requests';

interface IInitialState {
  user: IUser | null;
  foundUsers: IUser[];
}

const initialState: IInitialState = {
  user: null,
  foundUsers: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.foundUsers = action.payload;
      });
  },
});

export default userSlice.reducer;
