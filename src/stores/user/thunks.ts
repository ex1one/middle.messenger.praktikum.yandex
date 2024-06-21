import API from '@src/api';
import { apiHasError } from '@src/api/utils';
import userStore from './store';
import {
  SignInRequestData,
  SignUpRequestData,
  UpdateUserPasswordRequestData,
  User,
} from '@src/api/user/types';
import router from '@src/router';
import { PATHES } from '@src/consts';

export const signInThunk = async (data: SignInRequestData) => {
  const response = await API.user.signIn(data);
  if (apiHasError(response)) {
    throw new Error(response.reason);
  }
  const user = await API.user.getUser();
  userStore.set(user);
};

export const signUpThunk = async (data: SignUpRequestData) => {
  const response = await API.user.signUp(data);
  if (apiHasError(response)) {
    throw new Error(response.reason);
  }
  const user = await API.user.getUser();
  userStore.set(user);
};

export const logoutThunk = async () => {
  await API.user.logout();
  userStore.set(null);
  router.go(PATHES.SignIn);
};

export const getUserThunk = async () => {
  const responseUser = await API.user.getUser();
  if (apiHasError(responseUser)) {
    throw Error(responseUser.reason);
  }
  return responseUser;
};

export const updateUserProfileThunk = async (data: User) => {
  const response = await API.user.updateUserProfile(data);
  if (apiHasError(response)) {
    throw Error(response.reason);
  }
  userStore.set(response);
  return response;
};

export const updateUserPasswordThunk = async (
  data: UpdateUserPasswordRequestData,
) => {
  const response = await API.user.updateUserPassword(data);
  if (apiHasError(response)) {
    throw Error(response.reason);
  }
  const user = userStore.getState();
  userStore.set({ ...user, password: data.newPassword });
  return response;
};

export const updateUserAvatarThunk = async (data: FormData) => {
  const response = await API.user.updateUserAvatar(data);
  if (apiHasError(response)) {
    throw Error(response.reason);
  }
  userStore.set(response);
  return response;
};
