var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
export class ElementThree extends LitElement {
    constructor() {
        super(...arguments);
        this.name = "element-three";
        // createRenderRoot(){
        //   return this
        // }
        this.routes = [
            {
                path: "/three/three",
                experimentalPath: '/three',
                component: "<element-one></element-one>",
            },
            {
                path: "/three/three/*",
                experimentalPath: '/three/*',
                component: "<element-two></element-two>",
                bundle: () => import("../../src/pages/element-two"),
            },
        ];
    }
    render() {
        return html `
    <p>three</p>
    <eag-router-child .routes=${this.routes}></eag-router-child>
    `;
    }
}
__decorate([
    property(),
    __metadata("design:type", Object)
], ElementThree.prototype, "name", void 0);
customElements.define('element-three', ElementThree);
