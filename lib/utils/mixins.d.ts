import type { LitElement } from "lit";
import type { BehaviorSubject, Subject, Subscription } from "rxjs";
import type { Route } from "..";
declare type Constructor<T = LitElement> = new (...args: any[]) => T;
export declare class RouterElementInterface {
    subScriptions: Subscription[];
    routes: Route[];
    element: Element;
    addSub(sub: Subscription): void;
    resolveBundle(elem: Route, resolved: WeakSet<object>): Promise<Element>;
    observerHandler(theElement: Element, pageFoundSubject$: BehaviorSubject<boolean>, pendingSubject$: Subject<number>, contextQuerystring?: string, queryStringSubject$?: BehaviorSubject<string> | null, parentOrchild?: "parent" | "child"): void;
}
export declare const RouterMix: <T extends Constructor<LitElement>>(Base: T) => Constructor<RouterElementInterface> & T;
export {};
