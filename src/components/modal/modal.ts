import './modal.css';

import { Block, Events } from '@src/core';

import { renderIf } from '@src/helpers';

export interface IModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  withCloseButton?: boolean;
  children?: string;
}

export class Modal extends Block<IModalProps> {
  constructor(props: IModalProps) {
    super({
      Overlay: new ModalOverlay({
        events: {
          click: props.onClose,
        },
      }),
      withCloseButton: false,
      ...props,
    });
  }

  protected render(): string {
    const { isOpen, withCloseButton, children } = this.props;

    return `
        <div class="modal ${renderIf(isOpen, 'visible')}">
            {{{ Overlay }}}
            <div class="modal-content">
                ${renderIf(
                  withCloseButton,
                  `<button type="button" class="wrapper-close">
                        <span class="close"></span>
                    </button>`,
                )}
                ${renderIf(children, children)}
            </div>
        </div>
        `;
  }
}

interface IModalOverlayProps extends Events {}

export class ModalOverlay extends Block {
  constructor(props: IModalOverlayProps) {
    super(props);
  }

  protected render(): string {
    return `<span class="modal-overlay"></span>`;
  }
}
