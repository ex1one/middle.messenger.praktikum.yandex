import { User } from '@src/api/user/types';

export interface Chat {
  id: number;
  title: string;
  avatar: string;
  unread_count: number;
  created_by: number;
  last_message?: {
    user: User;
    time: string;
    content: string;
  } | null;
}

export type TChats = Chat[];

export interface GetChatsParams {
  offset: number;
  limit: number;
  title: string;
}

export interface ChatHistoryItem {
  chat_id: number;
  content: string;
  id: number;
  time: string;
  user_id: number;
}

export type ChatHistory = ChatHistoryItem[];

export interface GetChatHistoryParams {
  content: string;
  type: string;
}

// CREATE CHAT
export type CreateChatRequestData = Pick<Chat, 'title'>;
export type CreateChatResponseData = Pick<Chat, 'id'>;

// GET TOKEN
export type GetChatTokenRequestData = Chat['id'];
export type GetChatTokenResponseData = { token: string };
