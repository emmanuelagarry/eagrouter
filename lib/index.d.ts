import { LitElement } from 'lit-element';
import type { Subscription, Observable } from 'rxjs';
import type { Context } from './utils/interfaces';
export declare type NavState = 'navStart' | 'navEnd' | 'navCold';
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
export declare const latestRouterPath$: Observable<string>;
export declare class EagRouter extends LitElement {
    constructor();
    private element;
    routes: Route[];
    createRenderRoot(): this;
    firstUpdated(): void;
    installRoute(): void;
    changeRoute(context: Context): Promise<void>;
    render(): Element;
}
export declare class EagRouterChild extends LitElement {
    constructor();
    private element;
    subScriptions: Subscription[];
    latestPath$: Observable<string>;
    routes: Route[];
    initialPath: string | null;
    createRenderRoot(): this;
    connectedCallback(): void;
    disconnectedCallback(): void;
    renderView(path: string): Promise<void>;
    render(): Element;
}
