import './space.css';
import { Block } from '@src/core';

export class Space extends Block {
  protected render() {
    return `
          <div class="space"></div>
        `;
  }
}
