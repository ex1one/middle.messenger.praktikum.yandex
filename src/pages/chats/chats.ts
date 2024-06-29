// @ts-nocheck // TODO: FIX IT

import { PATHES } from '@src/consts';
import API from '@src/api';
import { Chat, TChats } from '@src/api/chats/types';
import { Block } from '@src/core';
import router from '@src/router';
import { ChatsLayout, ChatsSidebar } from '@src/templates';
import { ChatContentComponent } from '@src/templates/chats-layout/components/chat-content';

interface ChatsState {
  chats: TChats;
  selectedChat: Chat | null;
}

export class Chats extends Block<{}, ChatsState> {
  constructor() {
    const url = new URL(window.location.href);
    const chatId = url.searchParams.get('chat');

    super(undefined, { chats: [], selectedChat: null });

    API.chats.getChats().then((res) => {
      this.setState({
        chats: res,
        selectedChat:
          res.find((chat) => String(chat.id) === `${chatId}`) ?? null,
      });
    });
  }

  protected init(): void {
    const chatsLayout = new ChatsLayout({
      sidebarContent: new ChatsSidebar({
        chats: this.state.chats,
        selectedChat: this.state.selectedChat,
        addNewChat: () => {
          API.chats.getChats().then((res) => {
            this.setState({
              chats: res,
            });
          });
        },
        onChangeSelectedChat: (selectedChat) => {
          if (this.state.selectedChat === selectedChat) {
            this.setState({ selectedChat: null });
            router.go(PATHES.Chats);
          } else {
            this.setState({ selectedChat: selectedChat });
            router.go(PATHES.Chats + `?chat=${selectedChat.id}`);
          }
        },
      }),
      // @ts-ignore
      content: this.state.selectedChat
        ? new ChatContentComponent({
            selectedChat: this.state.selectedChat,
          })
        : `<div class="stub">
        Выберите чат чтобы отправить сообщение
      </div>`,
    });

    this.children = { ...this.children, ChatsLayout: chatsLayout };
  }

  protected render(): string {
    return `<div>{{{ ChatsLayout }}}</div>`;
  }
}
