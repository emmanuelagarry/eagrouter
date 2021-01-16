import { LitElement } from 'lit-element';
export interface Route {
    path: string;
    redirect?: string;
    component?: string;
    bundle?: () => Promise<any>;
}
export declare type NavState = 'navStart' | 'navEnd' | 'navCold';
export declare const navigationEvents$: import("rxjs").Observable<NavState>;
export declare const pending$: import("rxjs").Observable<boolean>;
export declare const queryString$: import("rxjs").Observable<string>;
export declare class EagRouter extends LitElement {
    constructor();
    private element;
    myWindow: Window & typeof globalThis;
    oldPath: string | null;
    pending: boolean;
    routes: Route[];
    createRenderRoot(): this;
    installRoute(): void;
    firstUpdated(): void;
    changeRoute(context: any): Promise<void>;
    currentView(): void;
    render(): HTMLElement;
}
