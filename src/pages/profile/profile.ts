import './profile.css';

import { Block } from '@src/core';

import {
  Divider,
  ProfileLogo,
  Button,
  Input,
  UploadProfileLogoModal,
  Space,
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
import {
  logoutThunk,
  updateUserPasswordThunk,
  updateUserProfileThunk,
} from '@src/stores/user/thunks';
import { connect } from '../../utils/connect';
import userStore from '@src/stores/user/store';

/* 
  Можно например когда меняется локальное состояние компонента через this.setState
  Вызывать метод CDU и п если пропсы меняются вызывать метод FLOW_RENDER + вызывать FLOW_RENDER у children всех

*/

export class Profile extends Block {
  constructor(props, state) {
    // TODO: Добавить возможность добавлять null в props и сделать типизированный state
    super(props, {
      ...state,
      profileLogo: null,
      isEditProfileData: false,
      isEditPassword: false,
      isOpen: false,
    });
  }

  // TODO: У нас каждый раз создаются новые компоненты при изменении пропсов или state. А нужно, чтобы они обновлялись исходя из изменение пропсов
  protected init() {
    const formProfile = useForm({
      initialValues: {
        InputEmail: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'email',
          value: this.state.email,
          textAlign: 'right',
          readonly: !this.state.isEditProfileData,
        }),
        InputLogin: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'login',
          value: this.state.login,
          textAlign: 'right',
          readonly: !this.state.isEditProfileData,
        }),
        InputFirstName: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'first_name',
          value: this.state.first_name,
          textAlign: 'right',
          readonly: !this.state.isEditProfileData,
        }),
        InputSecondName: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'second_name',
          value: this.state.second_name,
          textAlign: 'right',
          readonly: !this.state.isEditProfileData,
        }),
        InputDisplayName: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'display_name',
          value: this.state?.display_name ?? '-',
          textAlign: 'right',
          readonly: !this.state.isEditProfileData,
        }),
        InputPhone: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'phone',
          value: this.state.phone,
          textAlign: 'right',
          readonly: !this.state.isEditProfileData,
        }),
      },
      validationSchema: {
        InputEmail: SCHEMAS.USER.EMAIL,
        InputLogin: SCHEMAS.USER.LOGIN,
        InputFirstName: SCHEMAS.USER.FIRST_NAME,
        InputSecondName: SCHEMAS.USER.SECOND_NAME,
        InputPhone: SCHEMAS.USER.PHONE,
      },
      onSubmit: async (values) => {
        await updateUserProfileThunk(values);
        this.setState({ isEditProfileData: false });
      },
    });

    const formPassword = useForm({
      initialValues: {
        InputOldPassword: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'oldPassword',
          value: '',
          textAlign: 'right',
          type: 'password',
        }),
        InputNewPassword: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'newPassword',
          value: '',
          textAlign: 'right',
          type: 'password',
        }),
        InputConfirmNewPassword: new Input({
          variant: 'transparent',
          color: 'dark-gray',
          name: 'confirmNewPassword',
          value: '',
          textAlign: 'right',
          type: 'password',
        }),
      },
      validationSchema: {
        InputOldPassword: SCHEMAS.USER.PASSWORD,
        InputNewPassword: SCHEMAS.USER.PASSWORD,
        InputConfirmNewPassword: SCHEMAS.USER.PASSWORD,
      },
      onSubmit: async (values) => {
        const { confirmNewPassword, ...other } = values;

        await updateUserPasswordThunk(other);
        this.setState({ isEditPassword: false });
      },
    });

    const ProfileLayout = new AccountLayout({
      children: new ProfileContainer({
        ProfileLogo: new ProfileLogo({
          avatar: this.state.avatar,
          name: this.state.first_name,
          logoEvents: {
            click: () => {
              this.setState({
                isOpenUploadModal: !this.state.isEditProfileData,
              });
            },
          },
        }),
        ProfileData: this.state.isEditPassword
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
                Input: formProfile.values.InputFirstName,
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
          this.state.isEditPassword || this.state.isEditProfileData
            ? new ProfileActions({
                CancelProfileButton: new Button({
                  text: 'Отменить',
                  color: 'red',
                  events: {
                    click: () => {
                      this.setState({
                        isEditPassword: false,
                        isEditProfileData: false,
                      });
                    },
                  },
                }),
                SpaceBlock: new Space(),
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
                      this.setState({
                        isEditProfileData: !this.state.isEditProfileData,
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
                      this.setState({
                        isEditPassword: !this.state.isEditProfileData,
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
                    click: () => {
                      logoutThunk().catch(alert);
                    },
                  },
                }),
              }),
        events: {
          submit: this.state.isEditPassword
            ? formPassword.handleSubmit
            : formProfile.handleSubmit,
        },
      }),
    });

    const UploadModal = new UploadProfileLogoModal({
      isOpen: this.state.isOpenUploadModal,
      onClose: () => this.setState({ isOpenUploadModal: false }),
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

export const ProfilePage = connect((state) => state, userStore)(Profile);
