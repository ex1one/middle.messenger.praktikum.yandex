import { Button, Input } from '@src/components';
import { Block } from '@src/core';
import SCHEMAS from '@src/schemas';
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
        InputName: new Input({
          variant: 'underline',
          name: 'name',
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
        InputName: SCHEMAS.USER.NAME,
        InputSecondName: SCHEMAS.USER.SECOND_NAME,
        InputPhone: SCHEMAS.USER.PHONE,
        InputPassword: SCHEMAS.USER.PASSWORD,
        InputConfirmPassword: SCHEMAS.USER.CONFIRM_PASSWORD,
      },
      onSubmit: (values) => {
        console.log(values, 'values');
      },
    });

    const FormSignUp = new FormTemplate({
      title: 'Регистрация',
      body: new FormBody({
        InputEmail: form.values.InputEmail,
        InputLogin: form.values.InputLogin,
        InputName: form.values.InputName,
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
        LoginButton: new Button({
          variant: 'link',
          size: 'small',
          text: 'Войти',
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
