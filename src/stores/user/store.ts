import { Store } from '@src/core';

class UserStore extends Store {
  static __instance: UserStore;

  constructor(name: string, defaultState?: Record<string, any>) {
    if (UserStore.__instance) {
      return UserStore.__instance;
    }

    super(name, defaultState);
  }
}

const userStore = new UserStore('user');

export default userStore;
