import Handlebars from 'handlebars';
import * as Components from './components';
import * as Templates from './templates';
import * as Pages from './pages';

interface MenuItem {
  link: string;
  text: string;
}

const menu: MenuItem[] = [
  { link: 'sign-in', text: 'Вход' },
  { link: 'sign-up', text: 'Регистрация' },
  { link: 'profile', text: 'Профиль' },
  { link: 'profile-edit', text: 'Редактирование профиля' },
  { link: 'chats', text: 'Чаты' },
  { link: 'not-found', text: '404' },
  { link: 'server-error', text: '500' },
];

const pages = {
  'sign-in': [Pages.SignIn],
  'sign-up': [Pages.SignUp],
  'not-found': [Pages.NotFound],
  'server-error': [Pages.ServerError],
  'profile': [Pages.Profile],
  'profile-edit': [Pages.ProfileEdit],
  'chats': [Pages.Chats],
};

Object.entries(Components).forEach(([name, component]) => {
  Handlebars.registerPartial(name, component);
});

Object.entries(Templates).forEach(([name, component]) => {
  Handlebars.registerPartial(name, component);
});

function navigate(page: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const [source, context] = pages[page];
  const container = document.getElementById('content')!;
  container.innerHTML = Handlebars.compile(source)(context);
}

document.addEventListener('DOMContentLoaded', () => {
  const [page, context] = [Components.Navigate, { menu }];
  const container = document.getElementById('nav')!;
  container.innerHTML = Handlebars.compile(page)(context);
});

document.addEventListener('click', (event) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const page = event.target?.getAttribute('page');

  if (page) {
    navigate(page);

    event.preventDefault();
    event.stopImmediatePropagation();
  }
});
