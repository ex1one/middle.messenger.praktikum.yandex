import './account-layout.css';

import { Button } from '@src/components';
import { Block } from '@src/core';

interface IProps {
  children: Block;
}

export class AccountLayout extends Block<
  IProps & { BackButton: Block<object> }
> {
  constructor(props: IProps) {
    super({
      BackButton: new Button({
        arrow: 'left',
        variant: 'arrow',
        color: 'primary',
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
                  <div class="content__wrapper">
                      {{{ children }}}
                  </div>
              </div>
          </div>
        `;
  }
}
