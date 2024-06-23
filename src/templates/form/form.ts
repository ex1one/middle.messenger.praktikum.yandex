// @ts-nocheck // TODO: FIX IT

import './form.css';

import { Block, Events } from '@src/core';
import { FormBody, FormFooter } from './components';

interface FormTemplateProps extends Events {
  title: string;
  body: FormBody;
  footer: FormFooter;
}

export class FormTemplate extends Block<FormTemplateProps> {
  constructor(props: FormTemplateProps) {
    super({
      Form: new FormElement({
        children: `
        <div class="form__header">
          <h4 class="form__title">${props.title}</h4>
        </div>
        {{{ body }}}
        {{{ footer }}}
        `,
        className: 'form',
        ...props,
      }),
    });
  }

  protected render(): string {
    return `
        <div class="form__container">
            {{{ Form }}}
        </div>
        `;
  }
}

export interface FormElementProps extends Events {
  children: string;
  className?: string;
}

export class FormElement extends Block<FormElementProps> {
  constructor(props: FormElementProps) {
    super(props);
  }

  protected render(): string {
    const { className, children } = this.props;

    return `
      <form class="${className}">
          ${children}
      </form>
    `;
  }
}
