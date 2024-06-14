import { Button, Input } from '@src/components';
import { Block } from '@src/core';
import SCHEMAS from '@src/schemas';
import { FormBody, FormFooter, FormTemplate } from '@src/templates';
import { useForm } from '@src/utils';

export class SignIn extends Block {
  protected init(): void {
    const form = useForm({
      initialValues: {
        InputLogin: new Input({
          name: 'login',
          variant: 'underline',
          label: 'Логин',
        }),
        InputPassword: new Input({
          name: 'password',
          variant: 'underline',
          label: 'Пароль',
          type: 'password',
        }),
      },
      validationSchema: {
        InputLogin: SCHEMAS.USER.LOGIN,
        InputPassword: SCHEMAS.USER.PASSWORD,
      },
      onSubmit: (values) => {
        console.log(values, 'values');
      },
    });

    const FormSignIn = new FormTemplate({
      title: 'Вход',
      body: new FormBody({
        InputLogin: form.values.InputLogin,
        InputPassword: form.values.InputPassword,
      }),
      footer: new FormFooter({
        ButtonLogin: new Button({ text: 'Авторизоваться', type: 'submit' }),
        ButtonCreateAccount: new Button({
          variant: 'link',
          size: 'small',
          text: 'Нет аккаунта?',
        }),
      }),
      events: {
        submit: form.handleSubmit,
      },
    });

    this.children = { ...this.children, FormSignIn };
  }

  protected render(): string {
    return ` {{{ FormSignIn }}} `;
  }
}
