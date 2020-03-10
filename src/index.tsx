import { BehaviorSubject, Observable, UnaryFunction, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  FC
} from "react";

export type EqualityFn = (t: any, u: any) => boolean;

export const DEFAULT_EQ_FN: EqualityFn = (t, u) => t === u;

export type State<S> = BehaviorSubject<S>;

export type StateInitializer = <S>(initialState: S) => State<S>;

export interface Event<Type, Payload> {
  type: Type;
  payload: Payload;
}

export type DataSource<T> = Observable<T>;

export type BinaryFunction<T, U, R> = (t: T, u: U) => R;

export type Reaction<T, S> = BinaryFunction<S, T, S>;

export type DataSourceAdder = <S, T>(
  state: State<S>,
  dataSource: DataSource<T>,
  reaction: Reaction<T, S>,
  onError?: (err: any) => void,
  onComplete?: () => void
) => Subscription;

export type Transformation = <S, EType, EPayload>(
  state: State<S>,
  event: Event<EType, EPayload>
) => State<S>;

export type TransformationAdder = <S>(
  state: State<S>,
  transformation: Transformation
) => State<S>;

export type RestateHook = <S, RS>(
  pipe: UnaryFunction<S, RS>,
  dataSource?: Observable<S>,
  equalityFn?: EqualityFn
) => [State<S>, RS];

export interface RestateProps {
  initialValue: any;
}

const init: StateInitializer = initialState =>
  new BehaviorSubject(initialState);

// ???
// const initialState: State<any> = init<any>(null);

// This null is confusing...
const RestateContext = createContext<State<any>>(init(null));

export const addDataSource: DataSourceAdder = <S, T>(
  state: State<S>,
  dataSource: Observable<T>,
  reaction: Reaction<T, S>,
  onError?: (err: any) => void,
  onComplete?: () => void
) =>
  dataSource.subscribe(
    data => state.next(reaction(state.value, data)),
    onError,
    onComplete
  );

export const useRestate: RestateHook = <S, RS>(
  pipe: UnaryFunction<S, RS>,
  dataSource?: Observable<S>,
  equalityFn: EqualityFn = DEFAULT_EQ_FN
) => {
  const state = useContext(RestateContext);
  if (dataSource === undefined) dataSource = state;

  const [restate, setRestate] = useState<RS>(pipe(state.value));

  useEffect(() => {
    const subscription = dataSource?.pipe(map(pipe)).subscribe(newRestate => {
      if (!equalityFn(restate, newRestate)) setRestate(newRestate);
    });

    return () => {
      if (subscription !== undefined) subscription.unsubscribe();
    };
  }, [restate, pipe, dataSource, equalityFn]);

  return [state, restate];
};

export const Restate: FC<RestateProps> = ({ initialValue, children }) => (
  <RestateContext.Provider value={init(initialValue)}>
    {children}
  </RestateContext.Provider>
);
