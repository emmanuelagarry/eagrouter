import { LitElement, property } from "lit-element";

import page from "page";
import { BehaviorSubject, Subject } from "rxjs";
import type { Observable } from "rxjs";
import {
  distinctUntilChanged,
  map,
  shareReplay,
  tap,
  scan,
  startWith,
  skip,
  filter,
  throttleTime,
  buffer,
} from "rxjs/operators";

import { pathToRegexp } from "./utils/path-to-regex";
import {
  guardHandler,
  pathMatchKey,
  stringToHTML,
} from "./utils/helper-fuctions";
import type { Context } from "./utils/interfaces";
import { RouterMix } from "./utils/mixins";

// Interface for navigation state
export type NavState = "navStart" | "navEnd" | "navCold";

export interface Route {
  path: string;
  redirect?: string;
  component?: string;
  bundle?: () => Promise<any>;
  guard?: () => Observable<boolean> | Promise<boolean> | boolean;
}

let oldPath: string = "--";
const myWindow = window;

// Save lazy loaded modules in weak set
const resolved = new WeakSet();

const pendingSubject$ = new Subject<number>();

// Stores full query string
const queryStringSubject$ = new BehaviorSubject("");

// Stores latest router path
const latestRouterPathSubject$ = new BehaviorSubject<string>("");

// Exposes navigation events
export const navigationEvents$: Observable<NavState> = pendingSubject$.pipe(
  scan((acc, curr) => acc + curr, 0),
  map((num) => (num === 0 ? "navEnd" : "navStart")),
  startWith("navCold" as NavState),
  shareReplay(1)
);

const pageFoundSubject$ = new BehaviorSubject(false);
const pageFound$ = pageFoundSubject$.pipe(
  buffer(navigationEvents$.pipe(filter((env) => env === "navEnd"))),
  map((item) => item[item.length - 1])
);
// Exposes full query string
export const queryString$ = queryStringSubject$.pipe(
  skip(1),
  distinctUntilChanged(),
  shareReplay(1)
);

// Exposes query string of particular element
export const param$ = (id: string) =>
  queryString$.pipe(map((query) => new URLSearchParams(query).get(id)));

// exposes page router for navigating programatically

// This will be deprecated soon
export const outlet = (location: string) => page.show(location);

const push = (location: string) => page.show(location);
const replace = (
  path: string,
  state?: any,
  init?: boolean | undefined,
  dispatch?: boolean | undefined
) => page.replace(path, state, init, dispatch);

export const routerHistory = {
  push,
  replace,
};

Object.freeze(routerHistory);

// Exposes later router path

export const latestRouterPath$ = latestRouterPathSubject$.pipe(
  distinctUntilChanged(),
  shareReplay(1)
);

// Create lit element componenent
export class EagRouter extends RouterMix(LitElement) {
  constructor() {
    super();
  }
  base: string = "";
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    // Install routes
    this.installRoute();
    const newCustomEvent = new CustomEvent("eag-child-page-not-found", {
      bubbles: true,
      composed: true,
    });

    navigationEvents$.subscribe((item) => {
      console.log(item);
    });
    this.addToSub(
      pageFound$.pipe(
        throttleTime(500),
        tap((found) => {
          if (found === false) {
            this.dispatchEvent(newCustomEvent);
          }
        })
      )
    );
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

    page.base(this.base);

    page();
  }

  // This function changes routes
  async changeRoute(context: Context) {
    try {
      const elem = this.routes.find(
        (route) => route.path === context.routePath!
      );

      // Check if there is a guard
      const guardExist = elem?.guard;

      if (guardExist) {
        const guard = await guardHandler(guardExist, "parent");
        if (!guard) {
          return;
        }
      }

      if (!elem) {
        return;
      }

      // pageFoundSubject$.next(true);

      latestRouterPathSubject$.next(context.pathname!);
      if (oldPath.startsWith(elem.path)) {
        queryStringSubject$.next(context.querystring!);
        return;
      }

      pendingSubject$.next(1);

      // Resolve bundle if bundle exist and also reolve component.
      const theElement = await this.resolveBundle(elem, resolved);
      this.observerHandler(
        theElement,
        pageFoundSubject$,
        myWindow,
        pendingSubject$,
        context.querystring!,
        elem.path,
        queryStringSubject$,
        "parent"
      );
      oldPath = elem.path;
    } catch (error) {
      console.error(error);
      pendingSubject$.next(-1);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
  render() {
    return this.element;
  }
}
customElements.define("eag-router", EagRouter);

//  Child router
export class EagRouterChild extends RouterMix(LitElement) {
  private pathMatch = "eagPathMatch";
  private latestPath$ = latestRouterPath$.pipe(
    tap((route) => {
      if (route) {
        this.renderView(route);
      }
    })
  );

  private parentPath = "";
  get getParentPath() {
    return this.parentPath;
  }

  set setParentPath(parentPath: string) {
    this.parentPath = parentPath;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addToSub(this.latestPath$);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  async renderView(path: string) {
    if (pathToRegexp(this.pathMatch, [pathMatchKey]).test(path)) {
      // queueMicrotask(() => pendingSubject$.next(0));
      setTimeout(() => pendingSubject$.next(0));
      return;
    }
    try {
      const elem = this.routes.find((route) =>
        pathToRegexp(route.path, [pathMatchKey]).test(path)
      );
      if (!elem) {
        this.pathMatch = "eagPathMatch";
        this.element = stringToHTML("<eag-router-empty></eag-router-empty>");
        this.requestUpdate();
        pageFoundSubject$.next(false);
        // queueMicrotask(() => pendingSubject$.next(0));
        setTimeout(() => pendingSubject$.next(0));
        return;
      }
      this.pathMatch = elem.path;

      const guardExist = elem.guard;

      // Check for guard
      if (guardExist) {
        const guard = await guardHandler(guardExist, "child");
        if (!guard) {
          return;
        }
      }

      //increment pending count
      pendingSubject$.next(1);

      // Resolve bundle if bundle exist and also reolve component.
      const theElement = await this.resolveBundle(elem, resolved);

      // Using intersection observer to check when element is loaded
      this.observerHandler(
        theElement,
        pageFoundSubject$,
        myWindow,
        pendingSubject$,
        "",
        this.parentPath + elem.path,
        queryStringSubject$
      );
    } catch (error) {
      console.error(error);
      pendingSubject$.next(-1);
    }
  }

  render() {
    return this.element;
  }
}
customElements.define("eag-router-child", EagRouterChild);
