import myFetch from '@src/api/my-fetch';

import { YandexApi } from '../config/urls';
import {
  SearchUserByLoginRequestData,
  SignInRequestData,
  SignUpRequestData,
  SignUpResponseData,
  UpdateUserPasswordRequestData,
  User,
} from './types';

const BASE_URL = YandexApi;

export const signUp = (data: SignUpRequestData) => {
  return myFetch.post<SignUpResponseData>(BASE_URL + '/auth/signup', { data });
};

export const signIn = (data: SignInRequestData) => {
  return myFetch.post(BASE_URL + '/auth/signin', { data });
};

export const logout = () => {
  return myFetch.post(BASE_URL + '/auth/logout');
};

export const getUser = () => {
  return myFetch.get<User>(BASE_URL + '/auth/user');
};

export const updateUserProfile = (data: Partial<User>) => {
  return myFetch.put<User>(BASE_URL + '/user/profile', { data });
};

export const searchUserByLogin = (data: SearchUserByLoginRequestData) => {
  return myFetch.post<User[]>(BASE_URL + '/user' + '/search', { data });
};

// file = {avatar: binary} FormData
export const updateUserAvatar = (data: FormData) => {
  return myFetch.put<User>(BASE_URL + '/user/profile/avatar', { data });
};

export const updateUserPassword = (data: UpdateUserPasswordRequestData) => {
  return myFetch.put(BASE_URL + '/user/password', { data });
};

export const getUserAvatar = (path: string) => {
  return myFetch.get(BASE_URL + `/resources/${path}`, {
    params: { responseType: 'blob' },
  });
};
