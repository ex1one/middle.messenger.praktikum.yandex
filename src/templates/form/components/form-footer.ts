import { Block } from '@src/core';

interface IProps {}

export class FormFooter extends Block<IProps> {
  constructor(props: IProps) {
    super(props);
  }

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
      <div class="form__footer">
         ${renderStr()}
      </div>
      `;
  }
}
