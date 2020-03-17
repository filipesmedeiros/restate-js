import { BehaviorSubject, Observable, Subscription } from "rxjs";

export type ObsRestateStore<S> = BehaviorSubject<RestateStore<S>>;

export type ReactionID = string;

export type DataSource<T> = Observable<T>;

export type BinaryFunction<T, U, R> = (t: T, u: U) => R;

export type Reaction<T, S> = BinaryFunction<S, T, S>;

export type DataSourceAdder = <S, T>(
  state: ObsRestateStore<S>,
  dataSource: DataSource<T>,
  reaction: ReactionID,
  onError?: (err: any) => void,
  onComplete?: () => void
) => Subscription;

export const addDataSource: DataSourceAdder = <S, T>(
  state: ObsRestateStore<S>,
  dataSource: Observable<T>,
  reaction: ReactionID,
  onError?: (err: any) => void,
  onComplete?: () => void
) =>
  dataSource.subscribe(
    data =>
      state.next({
        state: state.value.reactions[reaction](state.value.state, data),
        reactions: state.value.reactions
      }),
    onError,
    onComplete
  );

export interface RestateStore<S = any> {
  state: S;
  reactions: {
    [reactionid: string]: Reaction<any, S>;
  };
}
