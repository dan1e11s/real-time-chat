import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/user.interface';
import api from '../../services/api';

interface ILogin {
  access_token: string;
  user: IUser;
}

export const login = createAsyncThunk<
  ILogin,
  { username: string; password: string }
>('auth/login', async (data) => {
  const res = await api.post('/auth/login', data);
  return res.data;
});

export const register = createAsyncThunk<
  void,
  { username: string; password: string }
>('auth/login', async (data) => {
  await api.post('/auth/login', data);
});

export const getUser = createAsyncThunk<IUser, string>(
  'get-user',
  async (userId) => {
    const { data } = await api.get(`users/${userId}`);
    return data;
  }
);

export const searchUsers = createAsyncThunk<IUser[], string>(
  'users/search',
  async (query) => {
    const { data } = await api.get(`/users/search?q=${query}`);
    return data;
  }
);
