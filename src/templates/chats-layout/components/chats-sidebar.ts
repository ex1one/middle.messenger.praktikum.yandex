import { PATHES } from '@src/consts';
import { renderIf } from '@src/helpers';
import { Divider, Input, NavLink } from '@src/components';
import { Block } from '@src/core';

import leftIcon from '@public/images/search.svg?raw';
import { Chat, TChats } from '@src/api/chats/types';

interface ChatsSidebarProps {
  chats: TChats;
  selectedChat: Chat | null;
  onChangeSelectedChat: (chat: Chat) => void;
}

export class ChatsSidebar extends Block<ChatsSidebarProps> {
  constructor(props: ChatsSidebarProps) {
    super({
      ...props,
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
      chats: props.chats.map(
        (chat) =>
          new ChatListItem({
            ...chat,
            isActive: Boolean(props.selectedChat?.id === chat.id),
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
    super(props);
  }

  protected render(): string {
    const { avatar, last_message, title, unread_count, isActive } = this.props;

    return `
        <li class="chat-list__item ${renderIf(isActive, 'selected')}">
            <div class="chat-list__avatar">
              ${renderIf(avatar, `<img src="${avatar}" alt="avatar" />`, '<div class="stub_avatar"></div>')}
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
                    <span class="chat-list__content-time">${new Date(last_message?.time).toLocaleTimeString().slice(0, 5)}</span>
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
