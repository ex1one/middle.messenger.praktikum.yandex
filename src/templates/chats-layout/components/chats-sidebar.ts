import { PATHES } from '@src/consts';
import { renderIf } from '@src/helpers';
import { Button, Divider, Input, NavLink } from '@src/components';
import { Block } from '@src/core';

import leftIcon from '@public/images/search.svg?raw';
import { Chat, TChats } from '@src/api/chats/types';
import API from '@src/api';

interface ChatsSidebarProps {
  chats: TChats;
  selectedChat: Chat | null;
  onChangeSelectedChat: (chat: Chat) => void;
  addNewChat: () => void;
}

export class ChatsSidebar extends Block<ChatsSidebarProps> {
  constructor(props: ChatsSidebarProps) {
    super({
      ...props,
      // @ts-ignore
      ProfileButtonLink: new NavLink({
        color: 'secondary',
        text: 'Профиль >',
        href: PATHES.Profile,
      }),
      SearchChatInput: new Input({
        variant: 'filled',
        name: 'chat',
        placeholder: 'Поиск',
        leftIcon,
      }),
      CreateChat: new Button({
        variant: 'primary',
        text: 'Создать чат',
        events: {
          click: () => {
            const title = prompt('Введите название чата');
            if (!title) return;
            API.chats
              .createChat({ title })
              .then(() => props.addNewChat())
              .catch(alert);
          },
        },
      }),
      DividerSidebarSearch: new Divider({}),
      ChatList: new ChatList({
        chats: props.chats,
        selectedChat: props.selectedChat,
        onChangeSelectedChat: props.onChangeSelectedChat,
      }),
    });
  }

  protected render(): string {
    return `
        <div class="chats-layout__sidebar">
            <div class="sidebar__search">
                  <div class="link-wrapper">
                      {{{ ProfileButtonLink }}}
                  </div>
                  {{{ SearchChatInput }}}
                  {{{ CreateChat }}}
              </div>
              {{{ ChatList }}}
            </div>
        </div>
    `;
  }
}

interface ChatListProps {
  chats: TChats;
  selectedChat: Chat | null;
  onChangeSelectedChat: (chat: Chat) => void;
}

export class ChatList extends Block<ChatListProps> {
  constructor(props: ChatListProps) {
    super({
      ...props,
      // @ts-ignore
      chats: props.chats.map(
        (chat) =>
          new ChatListItem({
            ...chat,
            isActive: Boolean(props.selectedChat?.id === chat.id),
            // @ts-ignore
            events: {
              click: () => {
                props.onChangeSelectedChat(chat);
              },
            },
          }),
      ),
    });
  }

  protected render(): string {
    return `
      <ul class="chats-list">
          {{{ chats }}}
      </ul>
    `;
  }
}

interface ChatListItemProps extends Chat {
  isActive: boolean;
}

export class ChatListItem extends Block<ChatListItemProps> {
  constructor(props: ChatListItemProps) {
    super({
      ...props,
      // @ts-ignore
      logoChatListItem: new LogoChatListItem({ avatar: props.avatar }),
    });
  }

  protected render(): string {
    const { last_message, title, unread_count, isActive } = this.props;

    return `
        <li class="chat-list__item ${renderIf(isActive, 'selected')}">
            <div class="chat-list__avatar">
              {{{ logoChatListItem }}}
            </div>
            <div class="chat-list__content">
                <div class="chat-list__content-start">
                    <h4>${title}</h4>
                    <p class="text">
                      ${renderIf(last_message, `${last_message?.content}`)}
                    </p>
                </div>
                ${renderIf(
                  last_message,
                  `
                  <div class="chat-list__content-end">
                    <span class="chat-list__content-time">${new Date(last_message?.time as string).toLocaleTimeString().slice(0, 5)}</span>
                    ${renderIf(
                      unread_count,
                      `<div class="chat-list__content-new-messages-count">
                        ${unread_count}
                      </div>
                      `,
                    )}
                </div>
            `,
                )}
            </div>
        </li>
    `;
  }
}

interface LogoChatListItemProps {
  avatar: string;
}

export class LogoChatListItem extends Block<LogoChatListItemProps> {
  constructor(props: LogoChatListItemProps) {
    super();

    API.resources.getResource(props.avatar).then((res) => {
      const image = URL.createObjectURL(res as Blob);
      // @ts-ignore
      this.setState({ image, prevAvatar: this.props.avatar });
    });
  }

  protected render(): string {
    // @ts-ignore
    const { image } = this.state;

    console.log(image);

    return `
        ${renderIf(image, `<img src="${image}" alt="avatar" />`, '<div class="stub_avatar"></div>')}
      `;
  }
}
