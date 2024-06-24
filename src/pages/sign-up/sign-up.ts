import { Button, Input, NavLink } from '@src/components';
import { PATHES } from '@src/consts';
import { Block } from '@src/core';
import router from '@src/router';
import SCHEMAS from '@src/schemas';
import { signUpThunk } from '@src/stores/user/thunks';
import { FormTemplate, FormFooter, FormBody } from '@src/templates';
import { useForm } from '@src/utils';

export class SignUp extends Block {
  protected init(): void {
    const form = useForm({
      initialValues: {
        InputEmail: new Input({
          variant: 'underline',
          name: 'email',
          label: 'Почта',
          type: 'email',
        }),
        InputLogin: new Input({
          variant: 'underline',
          name: 'login',
          label: 'Логин',
        }),
        InputFirstName: new Input({
          variant: 'underline',
          name: 'first_name',
          label: 'Имя',
        }),
        InputSecondName: new Input({
          variant: 'underline',
          name: 'second_name',
          label: 'Фамилия',
        }),
        InputPhone: new Input({
          variant: 'underline',
          name: 'phone',
          label: 'Телефон',
        }),
        InputPassword: new Input({
          variant: 'underline',
          name: 'password',
          label: 'Пароль',
          type: 'password',
        }),
        InputConfirmPassword: new Input({
          variant: 'underline',
          name: 'confirm_password',
          label: 'Пароль ещё раз',
          type: 'password',
        }),
      },
      validationSchema: {
        InputEmail: SCHEMAS.USER.EMAIL,
        InputLogin: SCHEMAS.USER.LOGIN,
        InputFirstName: SCHEMAS.USER.FIRST_NAME,
        InputSecondName: SCHEMAS.USER.SECOND_NAME,
        InputPhone: SCHEMAS.USER.PHONE,
        InputPassword: SCHEMAS.USER.PASSWORD,
        InputConfirmPassword: SCHEMAS.USER.CONFIRM_PASSWORD,
      },
      onSubmit: (values) => {
        // TODO: Remove
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirm_password, ...other } = values;
        // TODO: Remove
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        signUpThunk(other)
          .then(() => router.go(PATHES.Profile))
          .catch(alert);
      },
    });

    const FormSignUp = new FormTemplate({
      title: 'Регистрация',
      body: new FormBody({
        InputEmail: form.values.InputEmail,
        InputLogin: form.values.InputLogin,
        InputFirstName: form.values.InputFirstName,
        InputSecondName: form.values.InputSecondName,
        InputPhone: form.values.InputPhone,
        InputPassword: form.values.InputPassword,
        InputConfirmPassword: form.values.InputConfirmPassword,
      }),
      footer: new FormFooter({
        SignUpButton: new Button({
          text: 'Зарегистрироваться',
          type: 'submit',
        }),
        LoginButtonLink: new NavLink({
          size: 'small',
          text: 'Войти',
          href: PATHES.SignIn,
        }),
      }),
      events: {
        submit: form.handleSubmit,
      },
    });

    this.children = { ...this.children, FormSignUp };
  }

  protected render(): string {
    return ` {{{ FormSignUp }}} `;
  }
}
