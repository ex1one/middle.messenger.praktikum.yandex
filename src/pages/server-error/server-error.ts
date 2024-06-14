import { Block } from '@src/core';
import { PageErrorTemplate } from '@src/templates';

interface IProps {}

export class ServerError extends Block<IProps> {
  constructor(props: IProps) {
    super({
      ...props,
      ServerError: new PageErrorTemplate({
        status: 500,
        message: 'Мы уже фиксим',
      }),
    });
  }

  protected render(): string {
    return `
            {{{ServerError}}}
        `;
  }
}
