import { BehaviorSubject, Observable, UnaryFunction, Subscription } from "rxjs";
import { FC } from "react";
export declare type EqualityFn = (t: any, u: any) => boolean;
export declare const DEFAULT_EQ_FN: EqualityFn;
export declare type State<S> = BehaviorSubject<S>;
export declare type StateInitializer = <S>(initialState: S) => State<S>;
export interface Event<Type, Payload> {
    type: Type;
    payload: Payload;
}
export declare type DataSource<T> = Observable<T>;
export declare type BinaryFunction<T, U, R> = (t: T, u: U) => R;
export declare type Reaction<T, S> = BinaryFunction<S, T, S>;
export declare type DataSourceAdder = <S, T>(state: State<S>, dataSource: DataSource<T>, reaction: Reaction<T, S>) => Subscription;
export declare type Transformation = <S, EType, EPayload>(state: State<S>, event: Event<EType, EPayload>) => State<S>;
export declare type TransformationAdder = <S>(state: State<S>, transformation: Transformation) => State<S>;
export declare type RestateHook = <S, RS>(pipe: UnaryFunction<S, RS>, dataSource?: Observable<S>, equalityFn?: EqualityFn) => [State<S>, RS];
export interface RestateProps {
    initialValue: any;
}
export declare const addDataSource: DataSourceAdder;
export declare const useRestate: RestateHook;
export declare const Restate: FC<RestateProps>;
