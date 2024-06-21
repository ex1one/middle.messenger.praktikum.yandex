import { EventBus } from '@src/core';

export enum StoreEvents {
  Updated = 'Updated',
}

export class Store<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  State extends Record<string, any> = Record<string, any>,
> extends EventBus {
  private _name: string = '';
  private state: State = {} as State;

  constructor(name: string, defaultState: State = {} as State) {
    super();

    this._name = name;
    this.state = this.loadStateFromLocalStorage() || defaultState;
    this.set(this.state);
  }

  public getState() {
    return this.state;
  }

  public set(nextState: Partial<State>) {
    const prevState = { ...this.state };

    this.state = { ...this.state, ...nextState };
    this.saveStateToLocalStorage();

    this.emit(StoreEvents.Updated, prevState, nextState);
  }

  private saveStateToLocalStorage() {
    localStorage.setItem(this._name, JSON.stringify(this.state));
  }

  private loadStateFromLocalStorage(): State | null {
    const storedState = localStorage.getItem(this._name);
    if (storedState) {
      try {
        return JSON.parse(storedState) as State;
      } catch (e) {
        console.error('Error loading state from localStorage:', e);
      }
    }
    return null;
  }
}
