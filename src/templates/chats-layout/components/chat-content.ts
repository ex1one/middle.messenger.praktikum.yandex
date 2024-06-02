import './index.css'; // TODO: Назвать по другому

import { Block } from '@src/core';

import DotsVertical from '@public/images/dots-vertical.svg?raw';
import PaperClip from '@public/images/paperclip.svg?raw';
import { Button } from '../../../components/button/button';
import { Input } from '@src/components';
import { renderIf } from '@src/helpers';
import { FormElement } from '@src/templates';
import { useForm } from '@src/utils';

/*

Что осталось сделать:

Приоритет:
  1. Добавить валидацию на все формы
      - Авторизация
      - Регистрация
      - Отправка смс
      - Настройки пользователяы

  2. Добавить класс для работы с запросами (уже написан). Просто скопировать
  3. Пофиксить все TODO

  В последнию очередь:
    1. Добавить Eslint от airbnb
    2. Настройить editorconfig
    3. Добавить Stylelint

  И отправлять на проверку

*/

export interface TChat {}

interface ChatContentProps {
  selectedChat: TChat | null;
}

export class ChatContent extends Block<ChatContentProps> {
  constructor(props: ChatContentProps) {
    const form = useForm({
      initialValues: {
        MessageInput: new Input({ placeholder: 'Сообщение', name: 'message' }),
        SendButton: new Button({
          variant: 'arrow',
          arrow: 'right',
          type: 'submit',
        }),
      },
      validationSchema: {
        MessageInput: {
          regexp: new RegExp(/^.+$/m),
          messageError: 'Не должно быть пустым',
        },
      },
      onSubmit: (values) => {
        console.log(values);
      },
    });

    super({
      ...props,
      SendMessageForm: new FormElement({
        SendButton: form.values.SendButton,
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
      }),
    });
  }

  protected render(): string {
    const { selectedChat } = this.props;

    return `
        <div class="content__wrapper">
        ${renderIf(
          selectedChat,
          `<div class="chat-header">
        <div class="chat-header__avatar-and-name">
            <div class="avatar"></div>
            <h4>Андрей</h4>
        </div>
        <div class="chat-button__menu">
            ${DotsVertical}
        </div>
    </div>
    <div class="chat-body">
      <div class="history-message-june-19">
        <h5 class="history-date">
         19 июня
        </h5>
        <div class="messages">
          <div class="received-messages">
            <div class="message received-message">
              Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.

              Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.
              <span class="message-time">11:56</span>
            </div>
          </div>
         <div class="sent-messages">
            <div class="message sent-message">
              Круто!
              <span class="message-time">11:56</span>
            </div>
         </div>
        </div>
      </div>
    </div>
    {{{ SendMessageForm }}}
    `,
          `<div class="stub">
            Выберите чат чтобы отправить сообщение
          </div>`,
        )}
        </div>
        `;
  }
}
