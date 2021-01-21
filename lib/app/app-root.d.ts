import { LitElement } from 'lit-element';
import '../index';
import type { Route } from '../index';
export declare class AppRoot extends LitElement {
    routes: Route[];
    firstUpdated(): void;
    render(): import("lit-element").TemplateResult;
}
