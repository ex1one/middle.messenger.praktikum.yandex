import {
  CreateChatRequestData,
  CreateChatResponseData,
  GetChatsParams,
  GetChatTokenRequestData,
  GetChatTokenResponseData,
  TChats,
} from '@src/api/chats/types';
import { YandexApi, YandexWS } from '@src/api/config/urls';
import myFetch from '@src/api/my-fetch';

const BASE_URL = YandexApi;
const WS_BASE_URL = YandexWS;

export const getChats = (params?: GetChatsParams) => {
  return myFetch.get<TChats>(BASE_URL + '/chats', { data: params });
};

export const createChat = (data: CreateChatRequestData) => {
  return myFetch.post<CreateChatResponseData>(BASE_URL + '/chats', { data });
};

export const getChatToken = (chatId: GetChatTokenRequestData) => {
  return myFetch.post<GetChatTokenResponseData>(
    BASE_URL + '/chats' + `/token/${chatId}`,
  );
};

export const connectChatWebSocket = (
  userId: number,
  chatId: number,
  token: string,
) => {
  const socket = new WebSocket(
    WS_BASE_URL + `/chats/${userId}/${chatId}/${token}`,
  );

  return socket;
};

// Пока так, возможно как дойду до выполнения чатов. Доделаю.
export const getChatHistory = (socket: WebSocket, limit = '20') => {
  socket.send(
    JSON.stringify({
      content: limit,
      type: 'get old',
    }),
  );
};
