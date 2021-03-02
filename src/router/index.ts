import { LitElement, property, internalProperty } from "lit-element";

import page from "page";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import type { Subscription, Observable } from "rxjs";
import {
  distinctUntilChanged,
  map,
  shareReplay,
  tap,
  scan,
  startWith,
  filter,
  buffer,
  skip,
} from "rxjs/operators";

import { pathToRegexp } from "./utils/path-to-regex";
import {
  guardHandler,
  pathMatchKey,
  stringToHTML,
  routStringFormatter,
} from "./utils/helper-fuctions";
import type { Context } from "./utils/interfaces";

// Interface for navigation state
export type NavState = "navStart" | "navEnd" | "navCold";

export interface Route {
  path: string;
  redirect?: string;
  component?: string;
  bundle?: () => Promise<any>;
  guard?: () => Observable<boolean> | Promise<boolean> | boolean;
  hasChildren?: boolean;
  children?: Route[];
}

let oldPath: string = "--";

// let pathName = "";

const myWindow = window;

// Save lazy loaded modules in weak set
const resolved = new WeakSet();

const pendingSubject$ = new BehaviorSubject<number>(0);

// Stores full query string
const queryStringSubject$ = new BehaviorSubject("");

// Stores latest router path
const latestRouterPathSubject$ = new BehaviorSubject<string>("");

// Exposes navigation events
export const navigationEvents$: Observable<NavState> = pendingSubject$.pipe(
  skip(1),
  scan((acc, curr) => acc + curr, 0),
  map((num) => (num === 0 ? "navEnd" : "navStart")),
  startWith("navCold" as NavState),
  shareReplay(1)
);

const pageFoundBufferSubject$ = new BehaviorSubject<Boolean>(false);

const pageFoundBuffer$ = pageFoundBufferSubject$.pipe(
  skip(1),
  buffer(navigationEvents$.pipe(filter((nav) => nav === "navEnd"))),
  shareReplay(1)
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
const push = (location: string) => page.show(location);
const replace = (location: string) => page.show(location);

// Exposes later router path

export const routerHistory = {
  push,
  replace,
};

Object.freeze(routerHistory);

export const latestRouterPath$ = latestRouterPathSubject$
  .asObservable()
  .pipe(shareReplay(1));

/**
 * A Simple client side router that uses pagejs and a dependency and
 * has first clas support for Web components.
 */

/**
 *  Creates lit element componenent
 */
export class EagRouter extends LitElement {
  constructor() {
    super();
  }

  // set div as the base element
  @internalProperty()
  private element: Element = stringToHTML("<div></div>");

  routes: Route[] = [];

  base: string = "";

  private subs: Subscription[] = [];
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();

    const newEvent = new CustomEvent("child-page-not-found", {
      bubbles: true,
      composed: true,
    });


    this.addEventListener('update-requested', (event) => {
      event.stopPropagation()
      console.log('update-requested')
      this.requestUpdate()
    } )

    this.subs.push(
      pageFoundBuffer$.subscribe((buff) => {
        const pageExist = buff.find((item) => item === true);
        if (!pageExist && buff.length) {
          this.dispatchEvent(newEvent);
        }
      })
    );

    /**
       * Call to the install routes function to initialize pagejs
       * when the class is connected

       */
    this.installRoute();
  }

  disconnectedCallback() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    super.disconnectedCallback();
  }

  /**
   * This fucntion set up Pagejs when called,
   * It loops through the routes property with is an array of routes
   * and sets up the routes appropriately
   */
  installRoute() {
    try {
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
    } catch (error) {
      console.error(error);
    }
  }

  // This function changes routes
  async changeRoute(context: Context) {
    try {
      const elem =
        this.routes.find((route) => route.path === context.routePath) ||
        this.routes.find((route) => route.path === "*");

      if (!elem) {
        return;
      }
      if (elem?.guard) {
        const guard = await guardHandler(elem.guard, "parent");
        if (!guard) {
          return;
        }
      }

      // pathName = routStringFormatter(context.routePath);
      latestRouterPathSubject$.next(context.pathname!);

      if (oldPath.startsWith(elem.path)) {
        // console.log({oldPath, elemPath:elem.path}, )

        const child = this.element.querySelector<EagRouterChild>(
          "eag-router-child"
        );

        if (child) {
          child.checkRoute = routStringFormatter(elem.path);
        }
        return;
      }

      if (!elem.hasChildren) {
        pageFoundBufferSubject$.next(true);
      }
      pendingSubject$.next(1);

      // Resolve bundle if bundle exist.
      if (elem?.bundle) {
        if (!resolved.has(elem.bundle())) {
          await elem.bundle();
        }
      }
      this.element = stringToHTML(elem.component || "<div></div>");

      // Using intersection observr to check when element is loaded
      const io = new IntersectionObserver(async (_) => {
        if (elem.children) {
          // console.log(elem)
          const childRouter = this.element.querySelector<EagRouterChild>(
            "eag-router-child"
          );

          


          if (childRouter) {
            const parentPath = routStringFormatter(elem.path);

            const childElem = elem.children.find((item) => {
              //  console.log(routStringFormatter(elem.path) + item.path)
              return pathToRegexp(routStringFormatter(parentPath) + item.path, [
                pathMatchKey,
              ]).test(context.pathname!);
            });
            // console.log(childElem)

            if (childElem?.bundle) {
              if (!resolved.has(childElem.bundle())) {
                await childElem.bundle();
              }
            }



            childRouter.childeRoutes = elem.children;
            childRouter.setPathInitiator = parentPath + elem.path;
            childRouter.setResolvedPath = parentPath + elem.path
            childRouter.renderView(parentPath)

            // console.log(routStringFormatter(elem.path));
          }
        }
        // const element = this.querySelector('eag-router-child')
        // console.log(element)

        // Decrement pending count
        pendingSubject$.next(-1);
        queryStringSubject$.next(context.querystring!);
        myWindow.scrollTo(0, 0);
        io.disconnect();
      });
      io.observe(this);
      oldPath = elem.path;
    } catch (error) {
      console.error(error);
      pendingSubject$.next(-1);
    }
  }
  render() {
    return this.element;
  }
}
customElements.define("eag-router", EagRouter);

//  Child router
export class EagRouterChild extends LitElement {
  constructor() {
    super();
  }

  private routes: Route[] = [];

  set childeRoutes(r: Route[]) {
    this.routes = r;
  }

  outerThis = this;

  private pathInitiator = "";
  private resolvedPath = "--";


  /**
   * when called checkes if route should re-render itself
   */
  set checkRoute(path: string) {
    // console.log({path, pathInitiator: this.pathInitiator, routes: this.routes})
     
    this.renderView(path);
  }

  set setPathInitiator(path: string) {
    // console.log(path)
    this.pathInitiator = path;
    // this.resolvedPath = routStringFormatter(path)
  }

  set setResolvedPath(path: string) {
    // console.log(path)
    this.resolvedPath = routStringFormatter(path);
  }


  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("setPathInitiator", (event) => {
      // console.log(event.detail)
    });
  }

  checkSelf() {}

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  async renderView(path: string) {

    try {

      const locationPathname = await firstValueFrom(latestRouterPath$);

      /**
       *  Checks if path is active and signals children routes to check
       *  themselves if they should be rendered
       */
     
      if (
        pathToRegexp(this.resolvedPath, [pathMatchKey]).test(locationPathname)
      ) {
        const child = this.firstElementChild?.shadowRoot?.querySelector<EagRouterChild>(
          "eag-router-child"
        ) || this.firstElementChild?.querySelector<EagRouterChild>(
          "eag-router-child"
        )

        if (child) {
          child.checkRoute = routStringFormatter(this.resolvedPath);
        }
        return;
      }

      console.log(this.pathInitiator)

      const elem = this.routes.find((route) => {
        return pathToRegexp(path + route.path, [pathMatchKey]).test(
          locationPathname
        );
      });

      if (!elem) {
        pageFoundBufferSubject$.next(false);
        // this.element = stringToHTML("<div></div>");


        this.replaceChild(
          stringToHTML("<div></div>"),
          this.childNodes[0]
        );
        return;
      }

      console.log({elementPath: elem.path})

      this.resolvedPath = path  +elem.path;

      console.log(this.resolvedPath)

      if (elem?.path.split("/").length >= path.split("/").length) {
        pageFoundBufferSubject$.next(true);
      }

      if (elem?.guard) {
        const guard = await guardHandler(elem.guard, "child");
        if (!guard) {
          return;
        }
      }

      //increment pending count
      pendingSubject$.next(1);

      // Resolve bundle if bundle exist.
      if (elem?.bundle) {
        if (!resolved.has(elem.bundle())) {
          await elem.bundle();
        }
      }

    
    
      this.replaceChild(
        stringToHTML(elem?.component || "<div></div>"),
        this.childNodes[0]
      );


    
      const io = new IntersectionObserver(async (entry, observer) => {


        if (elem.children) {
          // console.log(elem)
       
          const childRouter = this.firstElementChild?.shadowRoot?.querySelector<EagRouterChild>(
            "eag-router-child"
          ) || this.firstElementChild?.querySelector<EagRouterChild>(
            "eag-router-child"
          )

         

          if (childRouter) {
            // const parentPath = routStringFormatter(elem.path);

            const childElem = elem.children.find((item) => {
              //  console.log(routStringFormatter(elem.path) + item.path)
              return pathToRegexp(routStringFormatter(this.resolvedPath) + item.path, [
                pathMatchKey,
              ]).test(locationPathname);
            });
            // console.log(childElem)

            if (childElem?.bundle) {
              if (!resolved.has(childElem.bundle())) {
                await childElem.bundle();
              }
            }

  
          
            childRouter.childeRoutes = elem.children;
            childRouter.setPathInitiator = this.resolvedPath + elem.path;

            childRouter.replaceChild(
              stringToHTML(childElem?.component || "<div></div>"),
              childRouter.childNodes[0]
            );
  

            // console.log(routStringFormatter(elem.path));
          }
        }







        // alert('something happend')
        // console.log(entries)
        // Decrement pending count
        pendingSubject$.next(-1);
        myWindow.scrollTo(0, 0);
        io.disconnect();
      });
      io.observe(this);
      this.requestUpdate();
    } catch (error) {
      console.error(error);
      pendingSubject$.next(-1);
    }
  }

  render() {
    return '';
  }
}
customElements.define("eag-router-child", EagRouterChild);
