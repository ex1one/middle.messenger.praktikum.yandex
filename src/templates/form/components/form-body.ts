import { Block } from '@src/core';

type Props = Record<string, Block<object>>;

export class FormBody extends Block<Props> {
  constructor(props: Props) {
    super(props);
  }

  // TODO: Попробовать вынести renderStr в отдельный метод или что-то другое. Придумать
  protected render(): string {
    const renderStr = () => {
      let result = '';

      Object.entries(this.props).forEach(([key, value]) => {
        if (value instanceof Block) {
          result = result + `{{{${key}}}}\n`;
        }
      });

      return result;
    };

    return `
        <div class="form__body">
          ${renderStr()}
        </div>
    `;
  }
}
