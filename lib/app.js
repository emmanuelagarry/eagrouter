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
import { customElement, property } from "lit/decorators.js";
import { routerHistory, navigationEvents$ } from "./router";
import "./router";
import "./pages/element-one";
let App = class App extends LitElement {
    constructor() {
        super(...arguments);
        this.routes = [
            {
                path: "",
                experimentalPath: "",
                redirect: "/one",
            },
            {
                path: "/one",
                experimentalPath: "/one",
                component: "<element-one></element-one>",
            },
            {
                path: "/two",
                experimentalPath: "/two",
                component: "<element-two></element-two>",
                bundle: () => import("../src/pages/element-two"),
                guard: () => {
                    return new Promise((resolve, _) => {
                        alert(false);
                        resolve(false);
                    });
                },
            },
            {
                path: "/three",
                experimentalPath: "/three",
                component: "<element-three></element-three>",
                bundle: () => import("../src/pages/element-three"),
            },
            {
                path: "/three/*",
                experimentalPath: "/three/*",
                component: "<element-three></element-three>",
                bundle: () => import("../src/pages/element-three"),
            },
            {
                path: "*",
                experimentalPath: "*",
                component: "<page-not-found></page-not-found>",
                bundle: () => import("../src/pages/page-not-found"),
            },
        ];
        this.bossText = "bossText";
    }
    connectedCallback() {
        super.connectedCallback();
        navigationEvents$.subscribe((item) => {
            // console.log(item)
        });
        this.addEventListener("eag-child-page-not-found", (_) => {
            console.log("PAGE-NOT-FOUND");
        });
    }
    routeP() {
        routerHistory.push("/three/20/yy");
    }
    routeP2() {
        routerHistory.push("/three/three/yy/ll");
    }
    routeP3() {
        routerHistory.push("/three/three/ll");
    }
    render() {
        return html `
      <a href="/one"><button>one</button></a>
      <a href="/two"><button>two</button></a>

      <a href="/three"><button>three</button></a
      ><a href="/three/three"><button>three three</button></a
      ><a href="/three/three/yy"><button>three three three</button></a>
      <a href="/three/three/zz"><button >three three three four</button></a> <br />
      <br>   <br>
      <a href="/three/three/yy/one"><button >three three three one</button></a> <br />
    
      <br />

      <button @click=${this.routeP}>programatic</button>
      <button @click=${this.routeP2}>programatic 2</button>
      <button @click=${this.routeP3}>programatic 3</button>

      <eag-router .routes=${this.routes}></eag-router>
    `;
    }
};
__decorate([
    property(),
    __metadata("design:type", Object)
], App.prototype, "bossText", void 0);
App = __decorate([
    customElement("app-root")
], App);
export { App };
