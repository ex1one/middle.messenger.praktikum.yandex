import { Block } from '@src/core';
import { PageErrorTemplate } from '@src/templates';

interface IProps {}

export class NotFound extends Block<IProps> {
  constructor(props: IProps) {
    super({
      ...props,
      NotFound: new PageErrorTemplate({
        status: 404,
        message: 'Не туда попали',
      }),
    });
  }

  protected render(): string {
    return `
            {{{NotFound}}}
        `;
  }
}
