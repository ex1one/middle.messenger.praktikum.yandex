import './index.css'; // TODO: Назвать по другому

import { Block } from '@src/core';

import DotsVertical from '@public/images/dots-vertical.svg?raw';
import PaperClip from '@public/images/paperclip.svg?raw';
import { Button } from '../../../components/button/button';
import { Input } from '@src/components';
import { renderIf } from '@src/helpers';
import { FormElement } from '@src/templates';
import { connect, useForm } from '@src/utils';
import {
  Chat,
  ChatHistory,
  ChatHistoryItem as TChatHistoryItem,
} from '@src/api/chats/types';
import {
  connectChatWebSocket,
  getChatHistory,
  getChatToken,
} from '@src/api/chats';
import userStore from '@src/stores/user/store';
import { User } from '@src/api/user/types';

interface SendMessageProps {
  socket: WebSocket;
}

export class SendMessage extends Block<SendMessageProps> {
  constructor(props: SendMessageProps) {
    super(props);
  }

  protected init(): void {
    const { socket } = this.props;

    const form = useForm({
      initialValues: {
        MessageInput: new Input({ placeholder: 'Сообщение', name: 'message' }),
      },
      validationSchema: {
        MessageInput: {
          regexp: new RegExp(/^.+$/m),
          messageError: 'Не должно быть пустым',
        },
      },
      onSubmit: (values) => {
        if (!socket) {
          alert('Нету соединения');
        } else {
          socket.send(
            JSON.stringify({ type: 'message', content: values.message }),
          );
        }
      },
    });

    const sendMessageForm = new FormElement({
      SendButton: new Button({
        variant: 'arrow',
        arrow: 'right',
        type: 'submit',
      }),
      MessageInput: form.values.MessageInput,
      className: 'chat-footer',
      children: `
            <div class="file-input">
              ${PaperClip}
            </div>
            <div class="message-input">
              {{{ MessageInput }}}
            </div>
            <div class="send-button">
              {{{ SendButton }}}
            </div>
          `,
      events: {
        submit: form.handleSubmit,
      },
    });

    this.children = { ...this.children, sendMessageForm };
  }

  protected render(): string {
    return `
      {{{ sendMessageForm }}}
    `;
  }
}

interface ChatContentProps {
  selectedChat: Chat;
}

export class ChatContent extends Block<
  ChatContentProps,
  { socket: WebSocket; history: ChatHistory; user: User }
> {
  constructor(
    props: ChatContentProps,
    state: { socket: WebSocket; history: ChatHistory; user: User },
  ) {
    console.log(state, 'state');
    super(props, state);

    getChatToken(props.selectedChat.id)
      .then(({ token }) => {
        return connectChatWebSocket(
          state.user.id,
          props.selectedChat.id,
          token,
        );
      })
      .then((socket) => {
        this.setState({ socket });

        socket.addEventListener('open', () => {
          console.log('Соединение установлено');

          socket.send(
            JSON.stringify({
              content: '0',
              type: 'get old',
            }),
          );
        });

        socket.addEventListener('close', (event) => {
          if (event.wasClean) {
            console.log('Соединение закрыто чисто');
          } else {
            console.log('Обрыв соединения');
          }

          console.log(`Код: ${event.code} | Причина: ${event.reason}`);
        });

        socket.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);
          console.log('Получены данные', data);

          if (Array.isArray(data)) {
            this.setState({ history: data.reverse() });
          } else {
            this.setState((prev) => {
              return { ...prev, history: [...prev.history, data] };
            });
          }
        });

        socket.addEventListener('error', (event) => {
          console.log('Ошибка', event.message);
        });

        return socket;
      })
      .catch(alert);
  }

  protected init(): void {
    const { selectedChat } = this.props;
    const { history = [], socket, user } = this.state;

    const historyChat = new HistoryChat({
      chat: selectedChat,
      history,
      user,
    });
    const sendMessage = new SendMessage({
      socket,
    });

    this.children = { ...this.children, historyChat, sendMessage };
  }

  protected render(): string {
    return `
      <div class="content__wrapper">
          {{{ historyChat }}}
          {{{ sendMessage }}} 
      </div>
    `;
  }
}

export const ChatContentComponent = connect(
  (state) => ({ user: state }),
  userStore,
)(ChatContent);

interface HistoryChatProps {
  chat: Chat;
  history?: ChatHistory;
  user: User;
}

export class HistoryChat extends Block<HistoryChatProps> {
  constructor(props: HistoryChatProps) {
    console.log(props);
    super({
      ...props,
      history: props.history?.map((item) => {
        return new ChatHistoryItem({ ...item, user: props.user });
      }),
    });
  }

  protected render(): string {
    const { chat } = this.props;

    return `
      <div>
        <div class="chat-header">
          <div class="chat-header__avatar-and-name">
              <div class="avatar">
                ${renderIf(chat.avatar, `<img src="${chat.avatar}" alt="avatar" />`, '<div class="stub_avatar"></div>')}
              </div>
              <h4>${chat.title}</h4>
          </div>
          <div class="chat-button__menu">
              ${DotsVertical}
          </div>
        </div>
        <div class="chat-body">
          {{{history}}}
        </div>
      </div>
        `;
  }
}

interface ChatHistoryItemProps extends TChatHistoryItem {
  user: User;
}

export class ChatHistoryItem extends Block<ChatHistoryItemProps> {
  constructor(props: ChatHistoryItemProps, state: any = {}) {
    super(props, state);
  }

  protected render(): string {
    const { content, time, user_id, user } = this.props;

    return `
      <div class="messages">
      ${renderIf(
        user_id !== user.id,
        `
        <div class="received-messages">
          <div class="message received-message">
            ${content}
            <span class="message-time">${new Date(time).toLocaleTimeString().slice(1, 5)}</span>
          </div>
        </div>
      `,
        `
        <div class="sent-messages">
            <div class="message sent-message">
            ${content}
            <span class="message-time">${new Date(time).toLocaleTimeString().slice(1, 5)}</span>
            </div>
        </div>
      `,
      )}
      </div>
    `;
  }
}
