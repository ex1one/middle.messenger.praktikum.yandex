import { Block, Store } from '@src/core';
import { isEqual } from './is-equal';
import { StoreEvents } from '@src/core/store';

export function connect<T extends Store>(
  mapStateToProps: (state: T) => Partial<T>,
  store: T,
) {
  return function <P, R>(Component: typeof Block<P, R>) {
    return class extends Component {
      private onChangeStoreCallback: () => void;
      constructor(props: P) {
        let state = mapStateToProps(store.getState());

        super(props, state);

        this.onChangeStoreCallback = () => {
          // при обновлении получаем новое состояние
          const newState = mapStateToProps(store.getState());

          // если что-то из используемых данных поменялось, обновляем компонент
          if (!isEqual(state, newState)) {
            this.setState({ ...newState });
          }

          // не забываем сохранить новое состояние
          state = newState;
        };

        // подписываемся на событие
        store.on(StoreEvents.Updated, this.onChangeStoreCallback);
      }

      componentWillUnmount() {
        super.componentWillUnmount();
        store.off(StoreEvents.Updated, this.onChangeStoreCallback);
      }
    };
  };
}
