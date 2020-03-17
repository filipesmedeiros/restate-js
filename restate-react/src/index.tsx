import { BehaviorSubject, Observable, UnaryFunction, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  FC
} from "react";
import {
  ObsRestateStore,
  ReactionID,
  RestateStore,
  DataSourceAdder,
  addDataSource
} from "restate-js";

export type EqualityFn = (t: any, u: any) => boolean;

export const DEFAULT_EQ_FN: EqualityFn = (t, u) => t === u;

export type StoreInitializer = <S>(
  restateStore: RestateStore<S>
) => ObsRestateStore<S>;

export type RestateHook = <S, RS>(
  pipe: UnaryFunction<S, RS>,
  equalityFn?: EqualityFn
) => RS;

export type DataSourceHook = <S, T>(
  dataSource: Observable<T>,
  reaction: ReactionID,
  onError?: (err: any) => void,
  onComplete?: () => void
) => void;

export interface RestateProps {
  store: RestateStore;
}

const init: StoreInitializer = initialState =>
  new BehaviorSubject(initialState);

// This initial store is confusing...
const RestateContext = createContext<ObsRestateStore<any>>(
  init({ state: null, reactions: {} })
);

export const useDataSource: DataSourceHook = <S, T>(
  dataSource: Observable<T>,
  reaction: ReactionID,
  onError?: (err: any) => void,
  onComplete?: () => void
) => {
  const store = useContext(RestateContext);
  useEffect(() => {
    const subscription = addDataSource(
      store,
      dataSource,
      reaction,
      onError,
      onComplete
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [store, dataSource, reaction, onError, onComplete]);
};

export const useRestate: RestateHook = <S, RS>(
  pipe: UnaryFunction<S, RS>,
  equalityFn: EqualityFn = DEFAULT_EQ_FN
) => {
  const store = useContext(RestateContext);

  const [restate, setRestate] = useState<RS>(pipe(store.value.state));

  useEffect(() => {
    const subscription = store
      .pipe(map(stor => pipe(stor.state)))
      .subscribe(newRestate => {
        if (!equalityFn(restate, newRestate)) setRestate(newRestate);
      });

    return () => subscription.unsubscribe();
  }, [restate, pipe, equalityFn]);

  return restate;
};

export type StoreHook = <S>() => ObsRestateStore<S>;

export const useStore: StoreHook = () => useContext(RestateContext);

export const Restate: FC<RestateProps> = props => (
  <RestateContext.Provider value={init(props.store)}>
    {props.children}
  </RestateContext.Provider>
);
