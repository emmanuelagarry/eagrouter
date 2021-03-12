import type { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import type { Route } from "..";
declare type Constructor<T = any> = new (...args: any[]) => T;
export declare const RouterMix: <T extends Constructor<any>>(Base: T) => {
    new (...args: any[]): {
        [x: string]: any;
        subScriptions: Subscription[];
        element: Element;
        connectedCallback(): void;
        addToSub(sub: Observable<any>): void;
        resolveBundle(elem: Route, resolved: WeakSet<object>): Promise<Element>;
        observerHandler(theElement: Element, pageFoundSubject$: BehaviorSubject<boolean>, myWindow: Window, pendingSubject$: Subject<number>, contextQuerystring: string | undefined, pendingCount: number, queryStringSubject$?: BehaviorSubject<string> | null, parentOrchild?: "parent" | "child"): void;
        disconnectedCallback(): void;
    };
} & T;
export {};
