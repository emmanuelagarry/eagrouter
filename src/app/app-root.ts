import { LitElement, html, customElement } from "lit-element";
import { of } from "rxjs";
import { tap } from "rxjs/operators";
import "../index";
import type { Route } from "../index";
import { navigationEvents$, latestRouterPath$ } from "../index";
@customElement("app-root")
export class AppRoot extends LitElement {
  routes: Route[] = [
    {
      path: "",
      redirect: "/home",
    },

    {
      path: "/home",
      component: "<home-page></home-page>",
      bundle: () => import("./home"),
      guard: () => new Promise((res, _) => res(true)),
    },

    {
      path: "/another",
      component: "<another-page></another-page>",
      bundle: () => import("./another"),
      guard: () => of(true),
    },
  ];

  routes2: Route[] = [
    {
      path: "/home",
      component: "<home-page></home-page>",
      bundle: () => import("./home"),
      guard: () => new Promise((res, _) => res(true)),
    },

    {
      path: "/another",
      component: "<another-page></another-page>",
      bundle: () => import("./another"),
      guard: () => {
        return of(true).pipe(
          tap((bol) => {
            if (!bol) {
              alert("bol");
            }
          })
        );
      },
    },
  ];

  firstUpdated() {
    navigationEvents$.subscribe((navigationEvents) =>
      console.log(navigationEvents)
    );
    latestRouterPath$.subscribe((navigationEvents) =>
      console.log(navigationEvents)
    );
  }

  render() {
    return html`<div>
      <a href="/home">Home</a> &nbsp; &nbsp; <a href="/another">Another</a>

      <eag-router .routes=${this.routes}></eag-router>
      <eag-router-child .routes=${this.routes2}></eag-router-child>
    </div>`;
  }
}
