import { Observable, UnaryFunction } from "rxjs";
import { FC } from "react";
import { ObsRestateStore, ReactionID, RestateStore } from "restate-js";
export declare type EqualityFn = (t: any, u: any) => boolean;
export declare const DEFAULT_EQ_FN: EqualityFn;
export declare type StoreInitializer = <S>(restateStore: RestateStore<S>) => ObsRestateStore<S>;
export declare type RestateHook = <S, RS>(pipe: UnaryFunction<S, RS>, equalityFn?: EqualityFn) => RS;
export declare type DataSourceHook = <S, T>(dataSource: Observable<T>, reaction: ReactionID, onError?: (err: any) => void, onComplete?: () => void) => void;
export interface RestateProps {
    store: RestateStore;
}
export declare const useDataSource: DataSourceHook;
export declare const useRestate: RestateHook;
export declare type StoreHook = <S>() => ObsRestateStore<S>;
export declare const useStore: StoreHook;
export declare const Restate: FC<RestateProps>;
