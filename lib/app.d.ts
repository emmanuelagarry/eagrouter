import { LitElement } from "lit";
import type { Route } from "./router";
import "./router";
import "./pages/element-one";
export declare class App extends LitElement {
    routes: Route[];
    bossText: string;
    connectedCallback(): void;
    routeP(): void;
    routeP2(): void;
    routeP3(): void;
    render(): import("lit").TemplateResult<1>;
}
