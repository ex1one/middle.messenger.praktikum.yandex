// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck // TODO: Поправить типы

import { nanoid } from 'nanoid';
import Handlebars from 'handlebars';
import EventBus from './event-bus';

export interface Events {
  events?: Partial<{
    [K in keyof HTMLElementEventMap]: (
      this: HTMLElement, // TODO: Подумать над реализацией дженерика для евентов
      ev: HTMLElementEventMap[K],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => any;
  }>;
}

// TODO: Добавить пропс state для хранения локального состояния у компонента

type IProps = Record<string | symbol, any> & Events;

class Block<Props extends IProps = IProps> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_CWU: 'flow:component-will-unmount',
    FLOW_RENDER: 'flow:render',
  };

  public id = nanoid(6);
  protected props: Props;
  private children: Record<string, Block<IProps>> = {};
  private eventBus: () => EventBus;
  private _element: HTMLElement | null = null;
  private _setUpdate = false;

  constructor(props: Props = {} as Props) {
    const eventBus = new EventBus();

    this.props = this._makePropsProxy(props);
    this._makeChildren(props);

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);

    eventBus.emit(Block.EVENTS.INIT);
  }

  // TODO: Нужно ли возвращать новую ссылку на children?
  _makeChildren(props: Props) {
    Object.entries(props).forEach(([key, value]) => {
      if (value instanceof Block) {
        this.children[key] = value;
      }
    });
  }

  _addEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this._element!.addEventListener(eventName, events[eventName]);
    });
  }

  _removeEvents() {
    const { events = {} } = this.props as { events: Record<string, Function> };

    Object.keys(events).forEach((eventName) => {
      this._element?.removeEventListener(
        eventName,
        events[eventName] as EventListenerOrEventListenerObject,
      );
    });
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CWU, this._componentWillUnmount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
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

  private _componentDidUpdate(oldProps: any, newProps: any) {
    if (this.componentDidUpdate(oldProps, newProps)) {
      this.eventBus().emit(Block.EVENTS.INIT);
    }
  }

  protected componentDidUpdate(oldProps: any, newProps: any) {
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

  setProps(newProps: Props & Record<string, unknown>) {
    if (!newProps) return;

    this._setUpdate = false;
    const oldProps = { ...this.props };

    Object.assign(this.props, newProps);

    if (this._setUpdate) {
      this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, newProps);
      Object.values(this.children).forEach((children) => {
        const oldProps = { ...children.props };
        children.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, newProps);
      });
    }
  }

  get element() {
    return this._element;
  }

  private _render() {
    const fragment = this.compile(this.render(), this.props);

    const newElement = fragment.firstElementChild as HTMLElement;

    if (this._element) {
      this._element.replaceWith(newElement);
    }

    this._element = newElement;

    this._addEvents();
  }

  private compile(template: string, context: Props) {
    const propsAndStubs = {
      ...context,
    };

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child.id}"></div>`;
    });

    const html = Handlebars.compile(template)(propsAndStubs);
    const temp = document.createElement('template');

    temp.innerHTML = html;

    Object.values(this.children).forEach((child) => {
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

  _makePropsProxy(props: Props) {
    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set: (target, prop, value) => {
        if (target[prop] !== value) {
          target[prop] = value;
          this._setUpdate = true;
        }

        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  show() {
    this.getContent()!.style.display = 'block';
  }

  hide() {
    this.getContent()!.style.display = 'none';
  }
}

export default Block;
