import { LitElement, property } from "lit-element";

import page from "page";
import { BehaviorSubject } from "rxjs";
import {
  distinctUntilChanged,
  map,
  publishReplay,
  refCount,
} from "rxjs/operators";

// Model for the router

export interface Route {
  path: string;
  redirect?: string;
  component?: string;
  bundle?: () => Promise<any>;
}

//  Navigation State
export type NavState = "navStart" | "navEnd" | "navCold";

// This saved bundle that had been lazy loaded
const resolved = new WeakSet();

// Navigation Behavoir sunject
const navigationEventsSubject$ = new BehaviorSubject<NavState>("navCold");

export const navigationEvents$ = navigationEventsSubject$.asObservable();

// Query string Subject
const queryStringSubject$ = new BehaviorSubject("");

//  This fucnction exposes the query string
export const queryString$ = queryStringSubject$.pipe(
  distinctUntilChanged(),
  publishReplay(1),
  refCount()
);

// This function exposes the query parameters

export const param$ = (id: string) =>
  queryString$.pipe(map((query) => new URLSearchParams(query).get(id)));

export class EagRouter extends LitElement {
  constructor() {
    super();
  }

  myWindow = window;

  //  Saves on path navigated to
  oldPath: string | null = null;

  //   Property Holding routes
  @property()
  routes: Route[] = [];

  //   This exposes the shadow root of the element

  // This property saved the base path of the element
  @property()
  basePath = "";

  createRenderRoot() {
    return this;
  }

  element: HTMLElement = document.createElement("div");

  installRoute() {
    this.routes.forEach((route) => {
      if (route.redirect) {
        page.redirect(route.path, route.redirect);
        return;
      }
      page(route.path, (context) => {
        this.changeRoute(context);
      });
    });

    page.base(this.basePath);

    page();
  }

  firstUpdated() {
    // Install routes on first updated
    this.installRoute();
  }

  async changeRoute(context: any) {
    const elem =
      this.routes.filter((route) => route.path === context.routePath)[0] ||
      this.routes.filter((route) => route.path === "*")[0];

    if (this.oldPath === elem.path) {
      return;
    }

    navigationEventsSubject$.next("navStart");

    if (elem.bundle) {
      if (!resolved.has(elem.bundle())) {
        await elem.bundle();
      }
    }

    if (!customElements.get(elem.component || "")) {
      navigationEventsSubject$.next("navEnd");
      throw new Error("Cant find Element");
    }

    const oldElement = this.element;

    // Create new cpmponent. Create empty element if undefined. This check is for satisifying typescripts compiler
    this.element = document.createElement(elem.component || "");

    this.requestUpdate("element", oldElement);

    // Listen for event web component ready. This event is used to detect navigation end.
    this.element.addEventListener("WebComponentsReady", (_) => {
      navigationEventsSubject$.next("navEnd");
      queryStringSubject$.next(context.querystring);

      this.myWindow.scrollTo(0, 0);
    });

    // Change old path
    this.oldPath = elem.path;
  }

  render() {
    return this.element;
  }
}
