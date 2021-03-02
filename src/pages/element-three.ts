import { LitElement, html, property } from "lit-element";
import type { Route } from "src/router";


export class ElementThree extends LitElement {
  @property()
  name = "element-three";

  createRenderRoot(){
    return this
  }

  routes: Route[] = [
    {
      path: "/three",
      component: "<element-one></element-one>",
    },
    {
      path: "/three/three/yy",
      component: "<element-one></element-one>",
    },
    // {
    //   path: "/three/*",
    //   component: "<element-two></element-two>",
    //   bundle: () => import("../..//src/pages/element-two"),
    // },
  ];
  render() {
    return html`
    <p>three</p>
    <eag-router-child></eag-router-child>
    `;
  }
}
customElements.define('element-three', ElementThree)
