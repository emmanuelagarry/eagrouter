import { LitElement, property } from "lit-element";

import page from "page";
import { BehaviorSubject, Subject } from "rxjs";
import type { Subscription, Observable } from "rxjs";
import {
  distinctUntilChanged,
  map,
  shareReplay,
  tap,
  scan,
} from "rxjs/operators";

export interface Route {
  path: string;
  redirect?: string;
  component?: string;
  bundle?: () => Promise<any>;
}

interface Context {
  new (path: string, state?: any): Context;
  [idx: string]: any;
  save: () => void;
  pushState: () => void;
  handled: boolean;
  canonicalPath: string;
  path: string;
  querystring: string;

  pathname: string;

  state: any;

  title: string;

  params: any;
}

import { pathToRegexp } from "./path-to-regex";

// Interface for navigation state
export type NavState = "navStart" | "navEnd" | "navCold";

// Save lazy loaded modules in weak set
const resolved = new WeakSet();

const pendingSubject$ = new Subject<number>();
export const navigationEvents$: Observable<NavState> = pendingSubject$
  .asObservable()
  .pipe(
    scan((acc, curr) => acc + curr, 0),
    map((num) => (num === 0 ? "navEnd" : "navStart")),
    shareReplay()
  );

const queryStringSubject$ = new BehaviorSubject("");

export const queryString$ = queryStringSubject$.pipe(
  distinctUntilChanged(),
  shareReplay()
);

export const param$ = (id: string) =>
  queryString$.pipe(map((query) => new URLSearchParams(query).get(id)));

export const outlet = (location: string) => page.show(location);

const latestRouterPathSubject$ = new BehaviorSubject<string | null>(null);
export const latestRouterPath$ = latestRouterPathSubject$
  .asObservable()
  .pipe(shareReplay());

const pathMatchKey = {
  delimiter: "/",
  name: "id",
  prefix: "",
  optional: true,
  partial: true,
  pattern: "",
  repeat: true,
};

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

  // Install routes
  firstUpdated() {
    this.installRoute();
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

  async changeRoute(context: Context) {
    latestRouterPathSubject$.next(context.path);
    const elem =
      this.routes.filter((route) => route.path === context.routePath)[0] ||
      this.routes.filter((route) => route.path === "*")[0];

    if (this.oldPath?.startsWith(elem.path)) {
      return;
    }

    pendingSubject$.next(-1);

    // Resolve bundle if bundle exist.
    if (elem?.bundle) {
      if (!resolved.has(elem.bundle())) {
        await elem.bundle();
      }
    }

    // If custom element exist,
    if (!customElements.get(elem.component || "div")) {
      pendingSubject$.next(1);
      throw new Error("Cant find Element");
    }

    const oldElement = this.element;

    this.element = document.createElement(elem?.component || "div");
    this.requestUpdate("element", oldElement);
    const observer = new IntersectionObserver((_) => {
      pendingSubject$.next(1);
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

export class EagRouterChild extends LitElement {
  constructor() {
    super();
  }

  private element: HTMLElement = document.createElement("div");

  myWindow = window;

  oldPath: string | null = null;

  subScriptions: Subscription[] = [];

  latestPath$ = latestRouterPath$.pipe(
    tap((route) => {
      if (route) {
        this.renderView(route);
      }
    })
  );

  @property()
  routes: Route[] = [];

  @property()
  initialPath: string | null = null;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();

    this.subScriptions.push(this.latestPath$.subscribe());
  }

  disconnectedCallback() {
    this.subScriptions.forEach((sub) => sub.unsubscribe());
    super.disconnectedCallback();
  }

  async renderView(path: string) {
    try {
      if (this.oldPath && path.startsWith(this.oldPath)) {
        return;
      }

      const index = this.routes.findIndex((route) =>
        pathToRegexp(route.path, [pathMatchKey]).test(path)
      );

      if (index > -1) {
        const elem = this.routes[index];
        pendingSubject$.next(-1);

        // Resolve bundle if bundle exist.
        if (elem?.bundle) {
          if (!resolved.has(elem.bundle())) {
            await elem.bundle();
          }
        }

        const oldElement = this.element;

        this.element = document.createElement(elem?.component || "div");
        this.requestUpdate("element", oldElement);
        const observer = new IntersectionObserver((_) => {
          pendingSubject$.next(1);

          this.myWindow.scrollTo(0, 0);
          observer.disconnect();
        });
        observer.observe(this.element);
        this.oldPath = path;
      }
    } catch (error) {
      pendingSubject$.next(1);
    }
  }

  currentView() {}
  render() {
    return this.element;
  }
}

customElements.define("eag-router-child", EagRouterChild);
