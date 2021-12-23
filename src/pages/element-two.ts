import { LitElement, html} from "lit";
import { property } from "lit/decorators.js";

import type { Route } from "../router";
import "../router"


export class ElementTwo extends LitElement {
  @property()
  name = "element-two";
  routes: Route[] = [
    {
      path: "/two",
      component: "<element-one></element-one>",
      bundle: () => import("../pages/element-one"),
    },
    {
      path: "/two/three/*",
      component: "<element-one></element-one>",
      bundle: () => import("../pages/element-one"),
    },
    // {
    //   path: "/three/three/zz",
    //   component: "<element-four></element-four>",
    //   bundle: () => import("../pages/element-four"),
    // },
    {
      path: "/three/three/yy",
      component: "<div></div>",
      // bundle: () => import("../pages/element-four"),
    },
  ];



  connectedCallback(){
    super.connectedCallback()
  }

  render() {
    return html`
    <p>two</p>
    <eag-router-child .routes=${this.routes}></eag-router-child>
    `;
  }
}
customElements.define('element-two', ElementTwo)
