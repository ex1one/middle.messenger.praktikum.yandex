import { nanoid } from 'nanoid';
import Handlebars from 'handlebars';
import EventBus from './event-bus';

export interface Events<T extends HTMLElement = HTMLElement> {
  events?: Partial<{
    [K in keyof HTMLElementEventMap]: (
      this: T,
      ev: HTMLElementEventMap[K],
    ) => void;
  }>;
}

type IProps = object & Events;

class Block<T extends IProps = IProps, S extends object = object> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_CWU: 'flow:component-will-unmount',
    FLOW_RENDER: 'flow:render',
  };

  public id = nanoid(6);
  protected props: T;
  protected state: S;
  protected children: Record<string | symbol, Block> = {};
  private eventBus: () => EventBus;
  private _element: HTMLElement | null = null;
  private _setUpdate = false;

  constructor(props: T = {} as T, state: S = {} as S) {
    const eventBus = new EventBus();

    this.props = this._makePropsProxy(props);
    this.state = this._makeStateProxy(state);
    this._makeChildren(props);

    this.eventBus = () => eventBus;
    this._registerEvents();
    eventBus.emit(Block.EVENTS.INIT);
  }

  _makePropsProxy(props: T) {
    return new Proxy(props, {
      get(target, prop) {
        const value = (target as { [index: string]: unknown })[prop as string];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set: (target, prop, value) => {
        if (
          (target as { [index: string]: unknown })[prop as string] !== value
        ) {
          (target as { [index: string]: unknown })[prop as string] = value;
          this._setUpdate = true;
        }

        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  _makeStateProxy(state: S) {
    return new Proxy(state, {
      get(target, prop) {
        const value = (target as { [index: string]: unknown })[prop as string];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set: (target, prop, value) => {
        if (
          (target as { [index: string]: unknown })[prop as string] !== value
        ) {
          (target as { [index: string]: unknown })[prop as string] = value;
          this._setUpdate = true;
        }

        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  _makeChildren(props: T) {
    Object.entries(props).forEach(([key, value]) => {
      if (value instanceof Block) {
        this.children[key] = value;
      }
    });
  }

  _registerEvents() {
    const eventBus = this.eventBus();
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CWU, this._componentWillUnmount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _addEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  _removeEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this._element?.removeEventListener(eventName, events[eventName]);
    });
  }

  private _init() {
    this.init();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  protected init() {}

  _componentDidMount() {
    this._checkInDom();
    this.componentDidMount();
  }

  componentDidMount() {}

  public dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);

    Object.values(this.children).forEach((child) =>
      child.dispatchComponentDidMount(),
    );
  }

  private _componentDidUpdate(oldProps: T, newProps: T) {
    if (this.componentDidUpdate(oldProps, newProps)) {
      this.eventBus().emit(Block.EVENTS.INIT);
      // Object.values(this.children).forEach((component) => {
      //
      //   const childrenOldProps = { ...component.props };
      //   const childrenNewProps = {};

      //   Object.keys(newProps).forEach((prop) => {
      //     // Тут может быть undefiend | null, но пропс все таки есть. То как быть?
      //     const existingProp = childrenOldProps[prop];

      //     if (existingProp) {
      //       childrenNewProps[prop] = existingProp;
      //     }
      //   });

      //   console.log(childrenNewProps, 'newProps');

      //   component
      //     .eventBus()
      //     .emit(Block.EVENTS.FLOW_CDU, childrenOldProps, childrenNewProps);
      // });
    }
  }

  protected componentDidUpdate(oldProps: T, newProps: T) {
    return JSON.stringify(oldProps) !== JSON.stringify(newProps);
  }

  _checkInDom() {
    const elementInDOM = document.body.contains(this._element);

    if (elementInDOM) {
      setTimeout(() => this._checkInDom(), 1000);
      return;
    }

    this.eventBus().emit(Block.EVENTS.FLOW_CWU);
  }

  _componentWillUnmount() {
    this.componentWillUnmount();
  }

  componentWillUnmount() {}

  setProps(newProps: T) {
    if (!newProps) return;

    this._setUpdate = false;
    const oldProps = { ...this.props };

    Object.assign(this.props, newProps);

    if (this._setUpdate) {
      this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, newProps);
    }
  }
  setState(fnOrState: Partial<S> | Function) {
    let newState = {};

    if (fnOrState instanceof Function) {
      newState = fnOrState(this.state);
    } else {
      newState = fnOrState;
    }

    if (!newState) return;

    this._setUpdate = false;
    const oldState = { ...this.state };

    Object.assign(this.state, newState);

    if (this._setUpdate) {
      this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldState, newState);
    }
  }

  get element() {
    return this._element;
  }

  private _render() {
    const fragment = this.compile(this.render(), this.props);

    const newElement = fragment.firstElementChild as HTMLElement;

    this._removeEvents();

    if (this._element) {
      this._element.replaceWith(newElement);
    }

    this._element = newElement;

    this._addEvents();
  }

  private compile(template: string, context: T) {
    const propsAndStubs = {
      ...context,
    };

    Object.entries(this.children).forEach(([key, child]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      propsAndStubs[key] = `<div data-id="${child.id}"></div>`;
    });

    const childrenProps: Block[] = [];
    Object.entries(propsAndStubs).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        propsAndStubs[key] = value
          .map((item) => {
            if (item instanceof Block) {
              childrenProps.push(item);
              return `<div data-id="${item.id}"></div>`;
            }

            return item;
          })
          .join('');
      }
    });

    const html = Handlebars.compile(template)(propsAndStubs);
    const temp = document.createElement('template');
    temp.innerHTML = html;

    [...Object.values(this.children), ...childrenProps].forEach((child) => {
      const stub = temp.content.querySelector(`[data-id="${child.id}"]`);
      stub?.replaceWith(child.getContent()!);
    });

    return temp.content;
  }

  protected render(): string {
    return '';
  }

  getContent() {
    // Хак, чтобы вызвать CDM только после добавления в DOM
    if (this.element?.parentNode?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      setTimeout(() => {
        if (
          this.element?.parentNode?.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
        ) {
          this.dispatchComponentDidMount();
        }
      }, 100);
    }

    return this._element;
  }

  show() {
    const block = this.getContent();
    if (!block) return;
    block.style.display = 'block';
  }

  hide() {
    const block = this.getContent();
    if (!block) return;
    block.style.display = 'none';
  }
}

export default Block;
