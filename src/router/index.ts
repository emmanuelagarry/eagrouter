import { LitElement, property, internalProperty } from "lit-element";
import type{ PropertyValues } from "lit-element";

import page from "page";
import { BehaviorSubject, Subject } from "rxjs";
import type { Subscription, Observable } from "rxjs";
import {
  distinctUntilChanged,
  map,
  shareReplay,
  tap,
  scan,
  startWith,
} from "rxjs/operators";

import { pathToRegexp } from "./utils/path-to-regex";
import {
  guardHandler,
  pathMatchKey,
  routStringFormatter,
  stringToHTML,
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
}

let oldPath: string = "--";
let pathName: string = "";

let reRun = false


let routeRegex = "";
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

// Exposes full query string
export const queryString$ = queryStringSubject$.pipe(
  distinctUntilChanged(),
  shareReplay(1)
);

// Exposes query string of particular element
export const param$ = (id: string) =>
  queryString$.pipe(map((query) => new URLSearchParams(query).get(id)));

// exposes page router for navigating programatically
// export const outlet = (location: string) => page.show(location);


export const routerHistory = {
  outlet: (location: string) => page.show(location),
  replace: (location: string) => page.replace(location)
}

Object.freeze(routerHistory)

// Exposes later router path

export const latestRouterPath$ = latestRouterPathSubject$
  .pipe(shareReplay(1));

// Create lit element componenent
export class EagRouter extends LitElement {
  constructor() {
    super();
  }

  // set div as the base element
  @internalProperty()
  private element: Element = stringToHTML("<div></div>");

  // @property({ type: Array })
  routes: Route[] = [];

  // @property({ type: String })
  base: string = "";

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    // Install routes
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

    page.base(this.base);

    page();
  }

  // This function changes routes
  async changeRoute(context: Context) {

    // console.log(context)
   
    if(pathName !== context.pathname){
      pathName  = context.canonicalPath!
     reRun = true;
    }else {
      
      reRun = false;
    }

    routeRegex = routStringFormatter(context.routePath);
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
      latestRouterPathSubject$.next(context.pathname!);

      if (oldPath.startsWith(elem.path)) {
        return;
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
      const observer = new IntersectionObserver((_) => {
        // Decrement pending count
        pendingSubject$.next(-1);
        queryStringSubject$.next(context.querystring!);
        myWindow.scrollTo(0, 0);
        observer.disconnect();
      });
      observer.observe(this.element);
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

  

  private initialization = 0;


  eagParentPathChanged$ = new Subject<{}>()

  @internalProperty()
  private element: Element = stringToHTML("<div></div>");

  subScriptions: Subscription[] = [];

  latestPath$ = latestRouterPath$.pipe(
    distinctUntilChanged(),
    tap((route) => {
          if (route && reRun) {
            console.log({route})
        this.renderView(route);
      }
    })
  );

  // @property({ type: Array })
  routes: Route[] = [];

  createRenderRoot() {
    return this;
    
  }

  connectedCallback() {
    super.connectedCallback();
    this.subScriptions.push(this.latestPath$.subscribe());
    // this.subScriptions.push(this.eagParentPathChanged$.subscribe(item => {
    //   console.log(item)
    // }))
  }

  disconnectedCallback() {
    this.subScriptions.forEach((sub) => {
      sub.unsubscribe()
    });
    
    super.disconnectedCallback();
  }
  async renderView(path: string) {
    try {
      let elem = this.routes.find((route) =>
        pathToRegexp(routeRegex + route.path, [pathMatchKey]).test(path)
      );
      // If index exist
      if (!elem) {
        if (this.initialization === 0) {
          const newEvent = new CustomEvent("child-page-not-found", {
            bubbles: true,
            composed: true,
          });

          this.dispatchEvent(newEvent);
        }
        return;
      } 
      routeRegex = routStringFormatter(routeRegex + elem.path);
      
      // if( this.initialization > 0){

     

      //   this.parentNode?.querySelector('eag-router-child')
      //     .eagParentPathChanged$
      //     .next({ routeRegex, init: this.initialization});

      
      //   return 
     
      // }

      // console.log( this.initialization)
    
      // console.log({ routeRegex2: routeRegex });

      this.initialization += 1;
      // console.log({elem, init2: this.initialization})

      // Check for guard
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

      

      // Create new element and update element
      this.element = stringToHTML(elem.component || "<div><div>");
      // Using intersection observer to check when element is loaded
      const observer = new IntersectionObserver((_) => {
        // Decrement pending count
        pendingSubject$.next(-1);

        myWindow.scrollTo(0, 0);
        observer.disconnect();
      });
      observer.observe(this.element);
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
