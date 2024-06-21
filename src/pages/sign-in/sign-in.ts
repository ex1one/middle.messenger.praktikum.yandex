import { SignInRequestData } from '@src/api/user/types';
import { Button, Input } from '@src/components';
import { PATHES } from '@src/consts';
import { Block } from '@src/core';
import router from '@src/router';
import SCHEMAS from '@src/schemas';
import { signInThunk } from '@src/stores/user/thunks';
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
      // TODO: Remove
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onSubmit: (values: SignInRequestData) => {
        signInThunk(values)
          .then(() => router.go(PATHES.Chats))
          .catch(alert);
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
          events: {
            click: () => {
              router.go(PATHES.SignUp);
            },
          },
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
