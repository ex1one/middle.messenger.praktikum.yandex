// TODO: Подумать над расположением этого файла в файловой структуре. Пока не нравится, что event-bus находится в core
// TODO: Типизация хромает в EventBus, есть ролик как улучшить эту типизацию

type ListenerValue = Array<() => unknown>;

export type Listener<T extends ListenerValue = ListenerValue> = (
  ...args: T
) => void;

export default class EventBus<
  E extends string = string,
  M extends { [K in E]: ListenerValue } = Record<E, ListenerValue>,
> {
  private listeners: { [key in E]?: Listener<M[E]>[] } = {};

  on(event: E, callback: Listener<M[E]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event]!.push(callback);
  }

  off(event: E, callback: Listener<M[E]>) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = this.listeners[event]!.filter(
      (listener) => listener !== callback,
    );
  }

  emit(event: E, ...args: M[E]) {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event]!.forEach((listener) => {
      listener(...args);
    });
  }
}
