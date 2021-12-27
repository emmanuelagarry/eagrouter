/// <reference types="page" />
import { LitElement } from "lit";
import type { Observable } from "rxjs";
import type { Context } from "./utils/interfaces";
export declare type NavState = "navStart" | "navEnd" | "navCold";
export interface Route {
    path: string;
    redirect?: string;
    component?: string;
    bundle?: () => Promise<any>;
    guard?: () => Observable<boolean> | Promise<boolean> | boolean;
    props?: {
        key: string;
        value: any;
    }[];
}
export declare const navigationEvents$: Observable<NavState>;
export declare const queryString$: Observable<string>;
export declare const param$: (id: string) =>  Observable<string | null>;
/** @deprecated */
export declare const outlet: (location: string) => void;
export declare const routerHistory: {
    push: (location: string) => void;
    replace: (path: string, state?: any, init?: boolean | undefined, dispatch?: boolean | undefined) => PageJS.Context;
};
export declare const latestRouterPath$: Observable<string>;
declare const EagRouter_base: (new (...args: any[]) => import("./utils/mixins").RouterElementInterface) & typeof LitElement;
export declare class EagRouter extends EagRouter_base {
    constructor();
    base: string;
    exactPathMatch: boolean;
    createRenderRoot(): this;
    connectedCallback(): void;
    installRoute(): void;
    changeRoute(context: Context): Promise<void>;
    render(): Element;
}
declare const EagRouterChild_base: (new (...args: any[]) => import("./utils/mixins").RouterElementInterface) & typeof LitElement;
export declare class EagRouterChild extends EagRouterChild_base {
    private pathMatch;
    private latestPath$;
    createRenderRoot(): this;
    connectedCallback(): void;
    renderView(path: string): Promise<void>;
    render(): Element;
}
export {};
