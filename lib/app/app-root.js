var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement } from 'lit-element';
import '../index';
import { navigationEvents$ } from '../index';
let AppRoot = class AppRoot extends LitElement {
    constructor() {
        super(...arguments);
        this.routes = [
            {
                path: "",
                redirect: "/home",
            },
            {
                path: "/home",
                component: "home-page",
                bundle: () => import("./home"),
            },
        ];
    }
    firstUpdated() {
        navigationEvents$.subscribe(navigationEvents => console.log(navigationEvents));
    }
    render() {
        return html `<div>
            Hello world
<eag-router .routes=${this.routes}></eag-router>


        </div>`;
    }
};
AppRoot = __decorate([
    customElement('app-root')
], AppRoot);
export { AppRoot };
