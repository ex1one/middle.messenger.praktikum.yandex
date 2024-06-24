// @ts-nocheck // TODO: FIX IT

import './upload-profile-logo-modal.css';

import { Block } from '@src/core';
import { renderIf } from '@src/helpers';
import { FileInput, Button } from '..';
import { IModalProps, Modal } from '../modal/modal';
import { FormElement } from '@src/templates';
import { useForm } from '@src/utils';
import { updateUserAvatarThunk } from '@src/stores/user/thunks';

// TODO: Создать template для модалок и использовать его
interface IUploadProfileLogoModalProps
  extends Pick<IModalProps, 'isOpen' | 'onClose'> {}

export class UploadProfileLogoModal extends Block<IUploadProfileLogoModalProps> {
  protected init(): void {
    const { isOpen, onClose } = this.props;

    const form = useForm({
      initialValues: {
        fileInput: new FileInput({
          name: 'avatar',
          value: null,
        }),
      },
      validationSchema: {},
      onSubmit: async (values) => {
        try {
          const formData = new FormData();
          formData.append('avatar', values.avatar);
          await updateUserAvatarThunk(formData);
          onClose();
        } catch (error) {
          alert(error);
          // this.setState({ error: error }); TODO: На будущее
        }
      },
    });

    const button = new Button({
      text: 'Поменять',
      type: 'submit',
    });

    const Form = new FormElement({
      className: 'form-modal',
      children: `
      <div class="header">
        <h4>${renderIf(form.values.fileInput.value, 'Файл загружен', 'Загрузите файл')}</h4>
      </div>
      <div class="body">
          {{{ fileInput }}}
      </div>
      <div class="footer">
          {{{ button }}}
      </div>
    `,
      fileInput: form.values.fileInput,
      button,
      events: {
        submit: form.handleSubmit,
      },
    });

    this.children = {
      ...this.children,
      UploadProfileLogoModal: new Modal({
        isOpen,
        onClose,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // TODO: Подумать как решить эту ситуацию
        Form,
        children: `{{{ Form }}}`,
      }),
    };
  }

  protected render(): string {
    return `{{{ UploadProfileLogoModal }}}`;
  }
}
