import './button.css';

import { renderIf } from '@src/helpers';
import { Block, Events } from '@src/core';

interface IProps extends Events {
  variant?: 'primary' | 'link' | 'arrow';
  color?: 'primary' | 'red' | 'secondary';
  size?: 'large' | 'small';
  arrow?: 'left' | 'right';
  text?: string;
  type?: 'submit' | 'button' | 'reset';
}

export class Button extends Block<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  protected render(): string {
    const {
      variant = 'primary',
      color = 'primary',
      size = 'large',
      text = '',
      arrow = false,
      type = 'button',
    } = this.props;

    return `
            <button type="${type}" class="${new String(`button button__${variant} ${renderIf(color, `button__${variant}--${color}`)} ${renderIf(size, `button__${variant}--${size}`)}`).trim()}">
                ${renderIf(arrow, `<div class="button-arrow__{{arrow}}"></div>`, text)}
            </button>
        `;
  }
}
