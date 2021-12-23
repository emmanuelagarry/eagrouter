import { LitElement, html} from "lit";
import {  property } from "lit/decorators.js";
import type { Route } from "src/router";


export class ElementThree extends LitElement {
  @property()
  name = "element-three";

  // createRenderRoot(){
  //   return this
  // }

  propTestParent = 'elemet three'

  routes: Route[] = [
   
    {
      path: "/three/three",
      props : [
        {
          key: 'propTest',
          value: 30
        },
        {
          key: 'someKey2',
          value: 1
        },
        {
          key: 'someKey3',
          value: 3
        },
      ],
      component: "<element-one class='dope'></element-one>",
    },


    {
      path: "/three/three/*",
      component: "<element-two></element-two>",
      bundle: () => import("../../src/pages/element-two"),
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
    <eag-router-child .routes=${this.routes}></eag-router-child>
    `;
  }
}
customElements.define('element-three', ElementThree)
