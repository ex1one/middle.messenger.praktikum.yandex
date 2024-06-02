import { Block } from '@src/core';

export interface ProfileActionsProps {}
export class ProfileActions extends Block<ProfileActionsProps> {
  constructor(props: ProfileActionsProps) {
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
        <div class="profile-actions">
          ${renderStr()}
        </div>
      `;
  }
}
