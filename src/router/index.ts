import { Block } from '@src/core';

export class Router {
  static __instance: Router;

  public routes: Route[] = [];
  public history = window.history;

  private _currentRoute: Route | null = null;
  private _rootQuery = '';

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  use(pathname: string, block: typeof Block) {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);

    return this;
  }

  start() {
    window.onpopstate = (event) => {
      // @ts-ignore
      this._onRoute(event.currentTarget.location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    const route = this.getRoute(pathname);

    if (!route) return;

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string) {
    const route = this.routes.find((route) => route.match(pathname));

    return route;
  }
}

export class Route {
  private _pathname: string;
  private _blockClass: typeof Block;
  private _block: Block | null;
  private _props: object & { rootQuery: string };

  constructor(
    pathname: string,
    view: typeof Block,
    props: object & { rootQuery: string },
  ) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block = null;
    }
  }

  match(pathname: string) {
    return pathname === this._pathname;
  }

  _renderDom(query: string, block: Block) {
    const root = document.querySelector(query);
    root?.replaceChildren(block.getContent() ?? '');
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass({});
      this._renderDom(this._props.rootQuery, this._block);
      return;
    }
  }
}

const router = new Router('#app');

export default router;
