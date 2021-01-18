import { LitElement, property } from "lit-element";

import page from "page";
import { BehaviorSubject } from "rxjs";
import {
  distinctUntilChanged,
  map,
  publishReplay,
  refCount,
  scan,
} from "rxjs/operators";

export interface Route {
  path: string;
  redirect?: string;
  component?: string;
  bundle?: () => Promise<any>;
}

// Interface for navigation state
export type NavState = "navStart" | "navEnd" | "navCold";

// Save lazy loaded modules in weak set
const resolved = new WeakSet();

const navigationEventsSubject$ = new BehaviorSubject<NavState>("navCold");
export const navigationEvents$ = navigationEventsSubject$.asObservable();

const queryStringSubject$ = new BehaviorSubject("");

export const queryString$ = queryStringSubject$.pipe(
  distinctUntilChanged(),
  publishReplay(1),
  refCount()
);

export const param$ = (id: string) =>
  queryString$.pipe(map((query) => new URLSearchParams(query).get(id)));

export const outlet = (location: string) =>  page.show(location)

// Create lit element compoenent
export class EagRouter extends LitElement {
  constructor() {
    super();
  }

  private element: HTMLElement = document.createElement("div");

  myWindow = window;

  oldPath: string | null = null;

  @property()
  pending = true;

  @property()
  routes: Route[] = [];

  createRenderRoot() {
    return this;
  }

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

    page.base("");

    page();
  }

  firstUpdated() {
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

    // Resolve bundle if bundle exist.
    if (elem.bundle) {
      if (!resolved.has(elem.bundle())) {
        await elem.bundle();
      }
    }

    // If custom element exist,
    if (!customElements.get(elem.component || "")) {
      navigationEventsSubject$.next("navEnd");
      throw new Error("Cant find Element");
    }

    const oldElement = this.element;

    this.element = document.createElement(elem.component || "");
    this.requestUpdate("element", oldElement);
    const observer = new IntersectionObserver((_) => {
      navigationEventsSubject$.next("navEnd");
      queryStringSubject$.next(context.querystring);
      this.myWindow.scrollTo(0, 0);
      observer.disconnect();
    });
    observer.observe(this.element);
    this.oldPath = elem.path;
  }

  currentView() {}
  render() {
    return this.element;
  }
}

customElements.define("eag-router", EagRouter);
