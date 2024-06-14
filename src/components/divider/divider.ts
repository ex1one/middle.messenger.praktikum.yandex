import './divider.css';
import { Block } from '@src/core';

interface IProps {}

export class Divider extends Block<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  protected init(): void {}

  protected render(): string {
    return `
          <div class="divider"></div>
        `;
  }
}
