import './page-error.css';
import { PATHES } from '@src/consts';

import { NavLink } from '@src/components';
import { Block } from '@src/core';
import { renderIf } from '@src/helpers';

interface IProps {
  status: number;
  message: string;
  back?: Block<object>;
}

export class PageErrorTemplate extends Block<IProps> {
  constructor(props: IProps) {
    super({
      back: new NavLink({
        text: 'Назад к чатам',
        size: 'small',
        href: PATHES.Chats,
      }),
      ...props,
    });
  }

  protected render(): string {
    const { status, message, back } = this.props;

    return `
        <div class="page-error-container">
            <div class="page-error-body">
            <h2 class="page-error-body__status">${status}</h2>
            <p class="page-error-body__description">${message}</p>
          </div>
          ${renderIf(back, `{{{back}}}`)}
        </div>
        `;
  }
}
