import './profile-logo.css';

import { renderIf } from '@src/helpers';
import { Block, Events } from '@src/core';
import { getUserAvatar } from '@src/api/user';

interface IProps extends Events {
  name?: string;
  avatar?: string;
  logoEvents?: Events['events'];
}

export class ProfileLogo extends Block<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  protected init(): void {
    const { avatar, logoEvents } = this.props;
    const logo = new Logo({ events: logoEvents, avatar });

    console.log('render');

    this.children = { ...this.children, logo };
  }

  protected render(): string {
    const { name } = this.props;

    return `
        <div class="logo__container">
          {{{ logo }}}
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

export class Logo extends Block<Pick<IProps, 'avatar' | 'events'>> {
  constructor(props: Pick<IProps, 'avatar' | 'events'>) {
    super(props, { image: null, prevAvatar: '' });
  }

  protected init(): void {
    if (this.props.avatar) {
      // TODO: Тут получается блик из-за того, что при изменении пропсов вызывается опять компонент Logo и все
      // Чтобы этого избежать, можно перенести state отвечающий за модалку внутрь ProfileLogo компонента.
      if (this.props.avatar !== this.state.prevAvatar) {
        getUserAvatar(this.props.avatar)
          .then((res) => {
            const image = URL.createObjectURL(res as Blob);
            this.setState({ image, prevAvatar: this.props.avatar });
          })
          .catch(alert);
      }
    }
  }

  protected render(): string {
    const { image } = this.state;

    return `
        <div class="logo__image">
          <img src="${renderIf(image, image, '/images/default-avatar.png')}" alt="avatar" />
          <div class="logo__overlay">Поменять аватар</div>
        </div>
      `;
  }
}
