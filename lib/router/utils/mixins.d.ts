import type { BehaviorSubject, Subscription } from "rxjs";
import type { Route } from "..";
declare type Constructor<T = any> = new (...args: any[]) => T;
export declare const RouterMix: <T extends Constructor<any>>(Base: T) => {
    new (...args: any[]): {
        [x: string]: any;
        subScriptions: Subscription[];
        routes: Route[];
        element: Element;
        connectedCallback(): void;
        addToSub(sub: any): void;
        resolveBundle(elem: Route, resolved: WeakSet<object>): Promise<Element>;
        observerHandler(theElement: Element, pageFoundSubject$: any, myWindow: Window, pendingSubject$: any, contextQuerystring?: string, queryStringSubject$?: BehaviorSubject<string> | null, parentOrchild?: "parent" | "child"): void;
        disconnectedCallback(): void;
    };
} & T;
export {};
