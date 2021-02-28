import { LitElement, html, property } from "lit-element";
import type { Route } from "../router";
import "../router"


export class ElementTwo extends LitElement {
  @property()
  name = "element-two";
  routes: Route[] = [
    {
      path: "/three/three/yy",
      component: "<element-one></element-one>",
      bundle: () => import("../pages/element-one"),
    },
  ];

  render() {
    return html`
    <p>two</p>
    <eag-router-child .routes=${this.routes}></eag-router-child>
    `;
  }
}
customElements.define('element-two', ElementTwo)
