/// <reference types="page" />
import { LitElement } from "lit";
import type { Observable } from "rxjs";
import type { Context } from "./utils/interfaces";
export declare type NavState = "navStart" | "navEnd" | "navCold";
export interface Route {
    path: string;
    experimentalPath: string;
    redirect?: string;
    component?: string;
    bundle?: () => Promise<any>;
    guard?: () => Observable<boolean> | Promise<boolean> | boolean;
}
export declare const navigationEvents$: Observable<NavState>;
export declare const queryString$: any;
export declare const param$: (id: string) => any;
export declare const outlet: (location: string) => void;
export declare const routerHistory: {
    push: (location: string) => void;
    replace: (path: string, state?: any, init?: boolean | undefined, dispatch?: boolean | undefined) => PageJS.Context;
};
export declare const latestRouterPath$: any;
declare const EagRouter_base: {
    new (...args: any[]): {
        [x: string]: any;
        subScriptions: any[];
        routes: Route[];
        element: Element;
        connectedCallback(): void;
        addToSub(sub: any): void;
        resolveBundle(elem: Route, resolved: WeakSet<object>): Promise<Element>;
        observerHandler(theElement: Element, pageFoundSubject$: any, myWindow: Window, pendingSubject$: any, contextQuerystring?: string, queryStringSubject$?: any, parentOrchild?: "parent" | "child"): void;
        disconnectedCallback(): void;
    };
} & typeof LitElement;
export declare class EagRouter extends EagRouter_base {
    constructor();
    base: string;
    createRenderRoot(): this;
    connectedCallback(): void;
    installRoute(): void;
    changeRoute(context: Context): Promise<void>;
    disconnectedCallback(): void;
    render(): Element;
}
declare const EagRouterChild_base: {
    new (...args: any[]): {
        [x: string]: any;
        subScriptions: any[];
        routes: Route[];
        element: Element;
        connectedCallback(): void;
        addToSub(sub: any): void;
        resolveBundle(elem: Route, resolved: WeakSet<object>): Promise<Element>;
        observerHandler(theElement: Element, pageFoundSubject$: any, myWindow: Window, pendingSubject$: any, contextQuerystring?: string, queryStringSubject$?: any, parentOrchild?: "parent" | "child"): void;
        disconnectedCallback(): void;
    };
} & typeof LitElement;
export declare class EagRouterChild extends EagRouterChild_base {
    private pathMatch;
    private latestPath$;
    createRenderRoot(): this;
    connectedCallback(): void;
    disconnectedCallback(): void;
    renderView(path: string): Promise<void>;
    render(): Element;
}
export {};
