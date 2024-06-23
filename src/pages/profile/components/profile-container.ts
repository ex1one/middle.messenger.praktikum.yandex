// @ts-nocheck // TODO: FIX IT

import { ProfileLogo } from '@src/components';
import { Block, Events } from '@src/core';

import { ProfileData } from './profile-data';
import { ProfileActions } from './profile-actions';
import { FormElement } from '@src/templates';

export interface ProfileContainerProps extends Events {
  ProfileLogo: ProfileLogo;
  ProfileData: ProfileData;
  ProfileActions: ProfileActions;
}
// TODO: Возможно передавать так пропсы не очень понятно, со стороны пользователя, который будет работать с кодом
export class ProfileContainer extends Block<ProfileContainerProps> {
  constructor(props: ProfileContainerProps) {
    const { ProfileLogo, ...otherProps } = props;

    super({
      ProfileLogo,
      Form: new FormElement({
        children: `
          {{{ ProfileData }}}
          {{{ ProfileActions }}}
      `,
        className: 'profile-form',
        ...otherProps,
      }),
    });
  }

  protected render(): string {
    return `
          <div class="profile-container">
              {{{ ProfileLogo }}}
              {{{ Form }}}
          </div>
        `;
  }
}
