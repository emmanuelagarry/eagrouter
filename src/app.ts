import { LitElement, html, customElement, property } from "lit-element";
import type { Route } from "./router";
import { routerHistory, navigationEvents$ } from "./router";

import "./router";
import "./pages/element-one";

@customElement("app-root")
export class App extends LitElement {
  routes: Route[] = [
    {
      path: "",
      redirect: "/one",
    },

    {
      path: "/one",
      component: "<element-one></element-one>",
      hasChildren: false,
    },

    {
      path: "/two",
      component: "<element-two></element-two>",
      hasChildren: true,
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
      component: "<element-three></element-three>",
      bundle: () => import("../src/pages/element-three"),
    },
    {
      path: "/three/*",
      component: "<element-three></element-three>",
      bundle: () => import("../src/pages/element-three"),
      hasChildren: true,
      children: [
        {
          path: "/three",
          component: "<element-one></element-one>",
        },
        {
          path: "/three/yy/:id",
          bundle: () => import("../src/pages/element-two"),
          component: "<element-two></element-two>",
          children: [
            {
              path: "/one",
              component: "<element-one></element-one>",
            },
          ],
        },
      ],
    },

    {
      path: "*",
      component: "<page-not-found></page-not-found>",
      bundle: () => import("../src/pages/page-not-found"),
    },
  ];

  @property()
  bossText = "bossText";

  connectedCallback() {
    super.connectedCallback();

    navigationEvents$.subscribe((item) => {
      // console.log(item)
    });
    this.addEventListener("child-page-not-found", (_) => {
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
    return html`
      <a href="/one"><button>one</button></a>
      <a href="/two"><button>two</button></a>

      <a href="/three"><button>three</button></a
      ><a href="/three/three"><button>three three</button></a
      ><a href="/three/three/yy"><button>three three three</button></a>
      <a href="/three/three/yy/one"><button >three three three one</button></a> <br />
      <br />

      <button @click=${this.routeP}>programatic</button>
      <button @click=${this.routeP2}>programatic 2</button>
      <button @click=${this.routeP3}>programatic 3</button>

      <eag-router .routes=${this.routes}></eag-router>
    `;
  }
}
