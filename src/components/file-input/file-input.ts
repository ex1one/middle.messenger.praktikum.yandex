import './file-input.css';

import { Block } from '@src/core';
import { renderIf } from '@src/helpers';

import { InputElement, InputElementProps } from '../input';

interface IFileInputProps
  extends Pick<InputElementProps, 'name' | 'className' | 'events'> {
  value: File | null;
  onChange?: (value: File) => void;
}

export class FileInput extends Block<IFileInputProps> {
  constructor(props: IFileInputProps) {
    const { events, className, onChange, ...otherProps } = props;

    const FileInput = new InputElement({
      ...otherProps,
      className: `file-input ${renderIf(className, className)}`,
      type: 'file',
      events: {
        ...events,
        change: (event) => {
          const fileList = (event.target as HTMLInputElement).files;

          if (!fileList?.length) return;

          const file = fileList[0];

          this.setProps({ value: file });

          if (onChange) onChange(file);
        },
      },
    });

    super({
      ...otherProps,
      FileInput,
      events: {
        click: () => {
          FileInput.element?.click();
        },
      },
    });
  }

  protected render(): string {
    const { value } = this.props;

    return `
        <div class="input">
            <label for="file-input" class="file-input-label">
              <span class="${renderIf(value, 'file-name', 'empty-file-name')}">
               ${renderIf(value, value?.name, 'Выбрать файл')}
              </span>
              {{{ FileInput }}}
            </label>
        </div>
        `;
  }
}
