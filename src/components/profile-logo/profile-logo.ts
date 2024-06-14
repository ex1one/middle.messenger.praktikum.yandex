import './profile-logo.css';

import { renderIf } from '@src/helpers';
import { Block, Events } from '@src/core';

interface IProps extends Events {
  name?: string;
  image?: string;
}

export class ProfileLogo extends Block<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  protected render(): string {
    const { name, image } = this.props;

    return `
        <div class="logo__container">
          <div class="logo__image">
            <img src="${renderIf(image, image, '/images/default-avatar.png')}" alt="avatar" />
            <div class="logo__overlay">Поменять аватар</div>
          </div>
          ${renderIf(
            name,
            `<div class="logo__text">
                ${name}
            </div>`,
          )}
        </div>
        `;
  }
}
