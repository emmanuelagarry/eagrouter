import { LitElement } from "lit-element";
import type { Subscription, Observable } from "rxjs";
export interface Route {
    path: string;
    redirect?: string;
    component?: string;
    bundle?: () => Promise<any>;
}
interface Context {
    new (path: string, state?: any): Context;
    [idx: string]: any;
    save: () => void;
    pushState: () => void;
    handled: boolean;
    canonicalPath: string;
    path: string;
    querystring: string;
    pathname: string;
    state: any;
    title: string;
    params: any;
}
export declare type NavState = "navStart" | "navEnd" | "navCold";
export declare const navigationEvents$: Observable<NavState>;
export declare const queryString$: Observable<string>;
export declare const param$: (id: string) => Observable<string | null>;
export declare const outlet: (location: string) => void;
export declare const latestRouterPath$: Observable<string | null>;
export declare class EagRouter extends LitElement {
    constructor();
    private element;
    myWindow: Window & typeof globalThis;
    oldPath: string | null;
    pending: boolean;
    routes: Route[];
    createRenderRoot(): this;
    firstUpdated(): void;
    installRoute(): void;
    changeRoute(context: Context): Promise<void>;
    currentView(): void;
    render(): HTMLElement;
}
export declare class EagRouterChild extends LitElement {
    constructor();
    private element;
    myWindow: Window & typeof globalThis;
    oldPath: string | null;
    subScriptions: Subscription[];
    latestPath$: Observable<string | null>;
    routes: Route[];
    initialPath: string | null;
    createRenderRoot(): this;
    connectedCallback(): void;
    disconnectedCallback(): void;
    renderView(path: string): Promise<void>;
    currentView(): void;
    render(): HTMLElement;
}
export {};
