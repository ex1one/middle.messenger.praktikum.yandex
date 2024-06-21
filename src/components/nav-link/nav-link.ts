import { Block } from '@src/core';
import { Link, LinkProps } from '@src/components';
import router from '@src/router';

interface NavLinkProps extends LinkProps {}

export class NavLink extends Block<NavLinkProps> {
  protected init(): void {
    const link = new Link({
      ...this.props,
      events: {
        ...this.props.events,
        click: (event) => {
          const passClickEvent = this.props.events?.click;

          if (passClickEvent) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            // TODO: Поправить ошибку
            passClickEvent(event);
          } else {
            router.go(this.props.href);
          }
        },
      },
    });

    this.children = { ...this.children, link };
  }

  protected render(): string {
    return ` {{{ link }}} `;
  }
}
