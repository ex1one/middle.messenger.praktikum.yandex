import './upload-profile-logo-modal.css';

import { Block } from '@src/core';
import { renderIf } from '@src/helpers';
import { FileInput, Button } from '..';
import { IModalProps, Modal } from '../modal/modal';

// TODO: Создать template для модалок и использовать его
interface IUploadProfileLogoModalProps
  extends Pick<IModalProps, 'isOpen' | 'onClose'> {
  value: File | null;
  onChange: (value: File | null) => void;
}

export class UploadProfileLogoModal extends Block {
  constructor(props: IUploadProfileLogoModalProps) {
    super(props);
  }

  protected init(): void {
    const { isOpen, onClose, value, onChange } = this.props;

    const fileInput = new FileInput({
      value,
      onChange,
    });
    const button = new Button({
      text: 'Поменять',
      type: 'submit',
    });

    this.children = {
      ...this.children,
      UploadProfileLogoModal: new Modal({
        isOpen,
        onClose,
        fileInput,
        button,
        children: `
      <form class="form-modal">
        <div class="header">
          <h4>${renderIf(value, 'Файл загружен', 'Загрузите файл')}</h4>
        </div>
        <div class="body">
            {{{ fileInput }}}
        </div>
        <div class="footer">
            {{{ button }}}
        </div>
      </form>
      `,
      }),
    };
  }

  protected render(): string {
    return `{{{ UploadProfileLogoModal }}}`;
  }
}
