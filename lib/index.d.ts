/// <reference types="page" />
import { LitElement } from "lit-element";
import { BehaviorSubject, Subject } from "rxjs";
import type { Subscription, Observable } from "rxjs";
import type { Context } from "./utils/interfaces";
export declare type NavState = "navStart" | "navEnd" | "navCold";
export interface Route {
    path: string;
    redirect?: string;
    component?: string;
    bundle?: () => Promise<any>;
    guard?: () => Observable<boolean> | Promise<boolean> | boolean;
}
export declare const navigationEvents$: Observable<NavState>;
export declare const queryString$: Observable<string>;
export declare const param$: (id: string) => Observable<string | null>;
export declare const outlet: (location: string) => void;
export declare const routerHistory: {
    push: (location: string) => void;
    replace: (path: string, state?: any, init?: boolean | undefined, dispatch?: boolean | undefined) => PageJS.Context;
};
export declare const latestRouterPath$: Observable<string>;
declare const EagRouter_base: {
    new (...args: any[]): {
        [x: string]: any;
        subScriptions: Subscription[];
        element: Element;
        connectedCallback(): void;
        addToSub(sub: Observable<any>): void;
        observerHandler(pageFoundSubject$: BehaviorSubject<boolean>, myWindow: Window, pendingSubject$: Subject<number>, contextQuerystring?: string, queryStringSubject$?: BehaviorSubject<string> | null, parentOrchild?: "parent" | "child"): void;
        disconnectedCallback(): void;
    };
} & typeof LitElement;
export declare class EagRouter extends EagRouter_base {
    constructor();
    routes: Route[];
    base: string;
    createRenderRoot(): this;
    connectedCallback(): void;
    disconnectedCallback(): void;
    installRoute(): void;
    changeRoute(context: Context): Promise<void>;
    render(): Element;
}
declare const EagRouterChild_base: {
    new (...args: any[]): {
        [x: string]: any;
        subScriptions: Subscription[];
        element: Element;
        connectedCallback(): void;
        addToSub(sub: Observable<any>): void;
        observerHandler(pageFoundSubject$: BehaviorSubject<boolean>, myWindow: Window, pendingSubject$: Subject<number>, contextQuerystring?: string, queryStringSubject$?: BehaviorSubject<string> | null, parentOrchild?: "parent" | "child"): void;
        disconnectedCallback(): void;
    };
} & typeof LitElement;
export declare class EagRouterChild extends EagRouterChild_base {
    private pathMatch;
    private latestPath$;
    routes: Route[];
    initialPath: string | null;
    createRenderRoot(): this;
    connectedCallback(): void;
    childRouterCheck(): EagRouterChild | null | undefined;
    disconnectedCallback(): void;
    renderView(path: string): Promise<void>;
    render(): Element;
}
export {};
