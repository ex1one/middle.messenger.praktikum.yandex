import { Block } from '@src/core';
import { ChatsLayout, ChatsSidebar, ChatContent } from '@src/templates';

import { TChat } from '@src/templates/chats-layout/components/chat-content';

interface ChatsProps {
  selectedChat: TChat | null;
}

export class Chats extends Block<ChatsProps> {
  constructor(props: ChatsProps) {
    super({ ...props, selectedChat: null });
  }

  protected init(): void {
    const chatsLayout = new ChatsLayout({
      selectedChat: this.props.selectedChat,
      sidebarContent: new ChatsSidebar({
        selectedChat: this.props.selectedChat,
        onChangeSelectedChat: (selectedChat) => {
          if (this.props.selectedChat === selectedChat) {
            this.setProps({ selectedChat: null });
          } else {
            this.setProps({ selectedChat: selectedChat });
          }
        },
      }),
      content: new ChatContent({
        selectedChat: this.props.selectedChat,
      }),
    });

    this.children = { ...this.children, ChatsLayout: chatsLayout };
  }

  protected render(): string {
    return `<div>{{{ ChatsLayout }}}</div>`;
  }
}
