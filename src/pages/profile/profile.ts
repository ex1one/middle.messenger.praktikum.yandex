import './profile.css';

import { Block } from '@src/core';

import {
  Divider,
  ProfileLogo,
  Button,
  Input,
  UploadProfileLogoModal,
} from '@src/components';
import { AccountLayout } from '@src/templates';

import {
  ProfileItem,
  ProfileData,
  ProfileContainer,
  ProfileActions,
} from './components';
import SCHEMAS from '@src/schemas';
import { useForm } from '@src/utils';

export class Profile extends Block {
  constructor(props) {
    super({
      ...props,
      isEditProfileData: false,
      isEditPassword: false,
      isOpenUploadModal: false,
    });
  }

  protected init(): void {
    const formProfile = useForm({
      initialValues: {
        InputEmail: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'email',
          value: 'pochta@yandex.ru',
          textAlign: 'right',
          readonly: !this.props.isEditProfileData,
        }),
        InputLogin: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'login',
          value: 'ivanivanov',
          textAlign: 'right',
          readonly: !this.props.isEditProfileData,
        }),
        InputName: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'first_name',
          value: 'Иван',
          textAlign: 'right',
          readonly: !this.props.isEditProfileData,
        }),
        InputSecondName: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'second_name',
          value: 'Иванов',
          textAlign: 'right',
          readonly: !this.props.isEditProfileData,
        }),
        InputDisplayName: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'display_name',
          value: 'Иван',
          textAlign: 'right',
          readonly: !this.props.isEditProfileData,
        }),
        InputPhone: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'phone',
          value: '+79099673030',
          textAlign: 'right',
          readonly: !this.props.isEditProfileData,
        }),
      },
      validationSchema: {
        InputEmail: SCHEMAS.USER.EMAIL,
        InputLogin: SCHEMAS.USER.LOGIN,
        InputName: SCHEMAS.USER.NAME,
        InputSecondName: SCHEMAS.USER.SECOND_NAME,
        InputPhone: SCHEMAS.USER.PHONE,
      },
      onSubmit: (values) => {
        console.log(values, 'values');
        this.setProps({ isEditProfileData: false });
      },
    });

    const formPassword = useForm({
      initialValues: {
        InputOldPassword: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'old_password',
          value: 'password',
          textAlign: 'right',
          type: 'password',
        }),
        InputNewPassword: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'new_password',
          value: 'password123',
          textAlign: 'right',
          type: 'password',
        }),
        InputConfirmNewPassword: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'confirm_new_password',
          value: 'password123',
          textAlign: 'right',
          type: 'password',
        }),
      },
      validationSchema: {
        InputEmail: SCHEMAS.USER.EMAIL,
        InputLogin: SCHEMAS.USER.LOGIN,
        InputName: SCHEMAS.USER.NAME,
        InputSecondName: SCHEMAS.USER.SECOND_NAME,
        InputPhone: SCHEMAS.USER.PHONE,
      },
      onSubmit: (values) => {
        this.setProps({ isEditPassword: false });
        console.log(values, 'values');
      },
    });

    const ProfileLayout = new AccountLayout({
      children: new ProfileContainer({
        ProfileLogo: new ProfileLogo({
          name: 'Иван',
          events: {
            click: () => {
              this.setProps({
                isOpenUploadModal: !this.props.isEditProfileData,
              });
            },
          },
        }),
        ProfileData: this.props.isEditPassword
          ? new ProfileData({
              OldPasswordProfileItem: new ProfileItem({
                name: 'Старый пароль',
                Input: formPassword.values.InputOldPassword,
              }),
              NewPasswordProfileItem: new ProfileItem({
                name: 'Новый пароль',
                Input: formPassword.values.InputNewPassword,
              }),
              ConfirmNewPasswordProfileItem: new ProfileItem({
                name: 'Повторите новый пароль',
                Input: formPassword.values.InputConfirmNewPassword,
              }),
            })
          : new ProfileData({
              EmailProfileItem: new ProfileItem({
                name: 'Почта',
                Input: formProfile.values.InputEmail,
              }),
              LoginProfileItem: new ProfileItem({
                name: 'Логин',
                Input: formProfile.values.InputLogin,
              }),
              FirstNameProfileItem: new ProfileItem({
                name: 'Имя',
                Input: formProfile.values.InputName,
              }),
              SecondNameProfileItem: new ProfileItem({
                name: 'Фамилия',
                Input: formProfile.values.InputSecondName,
              }),
              DisplayNameProfileItem: new ProfileItem({
                name: 'Имя в чате',
                Input: formProfile.values.InputDisplayName,
              }),
              PhoneProfileItem: new ProfileItem({
                name: 'Телефон',
                Input: formProfile.values.InputPhone,
              }),
            }),
        ProfileActions:
          this.props.isEditPassword || this.props.isEditProfileData
            ? new ProfileActions({
                SaveProfileButton: new Button({
                  text: 'Сохранить',
                  type: 'submit',
                }),
              })
            : new ProfileActions({
                ChangeProfileButton: new Button({
                  text: 'Изменить данные',
                  variant: 'link',
                  events: {
                    click: () => {
                      console.log('change profile data');
                      this.setProps({
                        isEditProfileData: !this.props.isEditProfileData,
                      });
                    },
                  },
                }),
                DividerProfileButton: new Divider({}),
                ChangePasswordButton: new Button({
                  text: 'Изменить пароль',
                  variant: 'link',
                  events: {
                    click: () => {
                      console.log('change password');
                      this.setProps({
                        isEditPassword: !this.props.isEditProfileData,
                      });
                    },
                  },
                }),
                DividerPasswordButton: new Divider({}),
                LogoutButton: new Button({
                  text: 'Выйти',
                  variant: 'link',
                  color: 'red',
                  events: {
                    click: () => console.log('Exit'),
                  },
                }),
              }),
        events: {
          submit: this.props.isEditPassword
            ? formPassword.handleSubmit
            : formProfile.handleSubmit,
        },
      }),
    });

    const UploadModal = new UploadProfileLogoModal({
      isOpen: this.props.isOpenUploadModal,
      onClose: () => this.setProps({ isOpenUploadModal: false }),
      value: null,
      onChange: (value) => {
        console.log(value);
      },
    });

    this.children = {
      ...this.children,
      ProfileLayout,
      UploadModal,
    };
  }

  protected render(): string {
    return `<div>
    {{{ ProfileLayout }}}
    {{{ UploadModal }}}
    </div>
    `;
  }
}
