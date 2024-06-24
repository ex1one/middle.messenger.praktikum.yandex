import './link.css';

import { renderIf } from '@src/helpers';
import { Block, Events } from '@src/core';

export interface LinkProps extends Events {
  variant?: 'default' | 'arrow';
  color?: 'primary' | 'red' | 'secondary';
  size?: 'large' | 'small';
  arrow?: 'left' | 'right';
  text?: string;
  target?: '_blank' | '_self';
  href: string;
}

export class Link extends Block<LinkProps> {
  protected render(): string {
    const {
      variant = 'default',
      color = 'primary',
      size = 'large',
      text = '',
      arrow = false,
      target = '_self',
    } = this.props;

    return `
        <a target="${target}" class="${new String(`link link__${variant} ${renderIf(color, `link--${color}`)} ${renderIf(size, `link--${size}`)}`).trim()}">
            ${renderIf(arrow, `<div class="link-arrow__{{arrow}}"></div>`, text)}
        </a>
    `;
  }
}
