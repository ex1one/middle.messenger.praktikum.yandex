import { Block } from '@src/core';

export class ProfileData extends Block {
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
        <div class="profile-data">
          ${renderStr()}
        </div>
      `;
  }
}
