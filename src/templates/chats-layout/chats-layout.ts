import './chats-layout.css';

import { Block } from '@src/core';
import { ChatContent, ChatsSidebar } from '.';

interface ChatsLayoutProps {
  sidebarContent: ChatsSidebar;
  content: ChatContent;
}

export class ChatsLayout extends Block<ChatsLayoutProps> {
  constructor(props: ChatsLayoutProps) {
    super(props);
  }

  protected render(): string {
    return `
        <div class="chats-layout__container">
            {{{ sidebarContent }}}
            <div class="chats-layout__content">
                {{{ content }}}
            </div>
        </div>
        `;
  }
}
