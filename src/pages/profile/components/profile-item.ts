import { Input } from '@src/components';
import { Block } from '@src/core';

export interface ProfileItemProps {
  name: string;
  Input: Input;
}

export class ProfileItem extends Block<ProfileItemProps> {
  protected render(): string {
    const { name } = this.props;

    return `
          <div class="profile-data__item">
              <p class="item__name">${name}</p>
              {{{ Input }}}
          </div>
        `;
  }
}
