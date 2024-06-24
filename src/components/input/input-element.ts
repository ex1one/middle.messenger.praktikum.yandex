import { renderIf } from '@src/helpers';
import { Block, Events } from '@src/core';
import { InputProps } from './input';

export interface InputElementProps
  extends Pick<
      InputProps,
      | 'color'
      | 'placeholder'
      | 'value'
      | 'readonly'
      | 'variant'
      | 'textAlign'
      | 'name'
      | 'type'
    >,
    Events {
  className?: string;
}

export class InputElement extends Block<InputElementProps> {
  protected render(): string {
    const {
      variant,
      value,
      name,
      color,
      placeholder,
      readonly,
      textAlign,
      type = 'text',
      className,
    } = this.props;

    return `
          <input
            ${renderIf(name, `name="${name}"`)}
            ${renderIf(type, `type="${type}"`)}
            ${renderIf(value, `value="${value}"`)}
            class="${new String(`input__element ${renderIf(variant, `input__element--${variant}`)} ${renderIf(color, `input__element--${color}`)} ${renderIf(textAlign, `input__element--${textAlign}`)} ${className}`).trim()}"
            ${renderIf(readonly, `readonly="${readonly}"`)}
            ${renderIf(variant === 'underline', `placeholder`, renderIf(placeholder, `placeholder="${placeholder}"`))}
          />
        `;
  }
}
