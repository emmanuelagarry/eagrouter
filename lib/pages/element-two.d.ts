import { LitElement } from "lit";
import type { Route } from "../router";
import "../router";
export declare class ElementTwo extends LitElement {
    name: string;
    routes: Route[];
    connectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
