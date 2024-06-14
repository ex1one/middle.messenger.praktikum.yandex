import { renderIf } from '@src/helpers';
import { Button, Divider, Input } from '@src/components';
import { Block } from '@src/core';

import leftIcon from '@public/images/search.svg?raw';
import { TChat } from './chat-content';

interface ChatsSidebarProps {
  selectedChat: TChat | null;
  onChangeSelectedChat: (chat: TChat) => void;
}

// TODO: Научиться рендерить массив элементов, как в react use .map
export class ChatsSidebar extends Block<ChatsSidebarProps> {
  constructor(props: ChatsSidebarProps) {
    super({
      ...props,
      ProfileButtonLink: new Button({
        variant: 'link',
        color: 'secondary',
        text: 'Профиль >',
      }),
      SearchChatInput: new Input({
        variant: 'filled',
        name: 'chat',
        placeholder: 'Поиск',
        leftIcon,
      }),
      DividerSidebarSearch: new Divider({}),
      ChatListItem: new ChatListItem({
        isActive: !!props.selectedChat,
        events: {
          click: () => {
            props.onChangeSelectedChat('new chat');
          },
        },
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
              <ul class="chats-list">
                 {{{ChatListItem}}}
              </ul>
            </div>
        </div>
    `;
  }
}

interface ChatListItemProps {
  avatar: string;
  display_name: string;
  isActive: boolean;
}

export class ChatListItem extends Block<ChatListItemProps> {
  constructor(props: ChatListItemProps) {
    super(props);
  }

  protected render(): string {
    const { avatar, display_name, isActive } = this.props;

    return `
        <li class="chat-list__item ${renderIf(isActive, 'selected')}">
            <div class="chat-list__avatar"></div>
            <div class="chat-list__content">
                <div class="chat-list__content-start">
                    <h4>Андрей</h4>
                    <p class="text">Изображение</p>
                </div>
                <div class="chat-list__content-end">
                    <span class="chat-list__content-time">10:49</span>
                    <div class="chat-list__content-new-messages-count">
                        2
                    </div>
                </div>
            </div>
        </li>
    `;
  }
}
