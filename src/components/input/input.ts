import './input.css';

import { renderIf } from '@src/helpers';
import { Block, Events } from '@src/core';
import { InputElement } from './input-element';

export interface InputProps extends Events {
  variant?: 'underline' | 'filled' | 'transparent';
  color?: 'dark-gray';
  name?: string;
  value?: string | File | null;
  label?: string;
  textAlign?: 'right';
  placeholder?: string;
  leftIcon?: string;
  readonly?: boolean;
  type?: string;
  error?: string | null;
}

export class Input extends Block<InputProps> {
  constructor(props: InputProps) {
    const { events, ...otherProps } = props;
    // TODO: Фиксануть типизацию у block
    super({
      ...otherProps,
      inputEvents: events,
    });
  }

  protected init(): void {
    this.children = {
      ...this.children,
      InputElement: new InputElement({
        ...this.props,
        events: this.props.inputEvents,
      }),
    };
  }

  protected render(): string {
    const { variant = 'filled', label, leftIcon, error } = this.props;

    // TODO: Не нравится, что я пропсы передаю ручками и каждый раз проверяю
    return `
          <div class="input">
            <label class="input__container input__container--${variant} ${renderIf(error, 'input__error')}">
                ${renderIf(
                  leftIcon,
                  `<div class="left-icon">
                      ${leftIcon}
                  </div>`,
                )}

                {{{ InputElement }}}

                ${renderIf(label, `<div class="input__label">${label}</div>`)}
                ${renderIf(error, `<div class="input__text-error">${error}</div>`)}
            </label>
        </div>
        `;
    z;
  }
}
