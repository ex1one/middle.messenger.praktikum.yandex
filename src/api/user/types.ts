export interface User {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  login: string;
  avatar: string;
  email: string;
}

export type SignUpRequestData = Omit<User, 'avatar' | 'display_name' | 'id'> & {
  password: string;
};

export type SignUpResponseData = Pick<User, 'id'>;

export interface SignInRequestData {
  login: string;
  password: string;
}

export interface UpdateUserPasswordRequestData {
  oldPassword: string;
  newPassword: string;
}

export interface SearchUserByLoginRequestData {
  login: string;
}
