import Handlebars from 'handlebars';
import * as Components from './components';
import * as Templates from './templates';
import * as Pages from './pages';
import router from '@src/router';
import { PATHES } from '@src/consts';

Object.entries(Components).forEach(([name, component]) => {
  if (typeof component === 'string') {
    Handlebars.registerPartial(name, component);
  }
});

Object.entries(Templates).forEach(([name, component]) => {
  if (typeof component === 'string') {
    Handlebars.registerPartial(name, component);
  }
});

router
  .use(PATHES.SignIn, Pages.SignIn)
  .use(PATHES.SignUp, Pages.SignUp)
  .use(PATHES.Profile, Pages.Profile)
  .use(PATHES.Chats, Pages.Chats);

router.start();
