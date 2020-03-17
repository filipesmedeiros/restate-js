import { BehaviorSubject, Observable, Subscription } from "rxjs";
export declare type ObsRestateStore<S> = BehaviorSubject<RestateStore<S>>;
export declare type ReactionID = string;
export declare type DataSource<T> = Observable<T>;
export declare type BinaryFunction<T, U, R> = (t: T, u: U) => R;
export declare type Reaction<T, S> = BinaryFunction<S, T, S>;
export declare type DataSourceAdder = <S, T>(state: ObsRestateStore<S>, dataSource: DataSource<T>, reaction: ReactionID, onError?: (err: any) => void, onComplete?: () => void) => Subscription;
export declare const addDataSource: DataSourceAdder;
export interface RestateStore<S = any> {
    state: S;
    reactions: {
        [reactionid: string]: Reaction<any, S>;
    };
}
