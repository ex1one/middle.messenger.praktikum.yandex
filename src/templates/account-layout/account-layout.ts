import './account-layout.css';

import { NavLink } from '@src/components';
import { PATHES } from '@src/consts';
import { Block } from '@src/core';

interface IProps {
  children: Block;
}

export class AccountLayout extends Block<
  IProps & { BackButton: Block<object> }
> {
  constructor(props: IProps) {
    super({
      BackButton: new NavLink({
        arrow: 'left',
        variant: 'arrow',
        color: 'primary',
        href: PATHES.Chats,
      }),
      ...props,
    });
  }

  protected render(): string {
    return `
          <div class="account-layout__container">
              <div class="account-layout__sidebar">
                  {{{ BackButton }}}
              </div>
              <div class="account-layout__content">
                  <div class="account-layout-content__wrapper">
                      {{{ children }}}
                  </div>
              </div>
          </div>
        `;
  }
}
