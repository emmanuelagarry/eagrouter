import { LitElement, property } from "lit-element";

import { html, directive } from "lit-html";


import page from "page";
import {
  BehaviorSubject,
  Subject,
  isObservable,
  firstValueFrom,
} from "rxjs";
import type { Subscription, Observable } from "rxjs";
import {
  distinctUntilChanged,
  map,
  shareReplay,
  tap,
  scan,
} from "rxjs/operators";


import { pathToRegexp } from "./path-to-regex";

// Interface for navigation state
export type NavState = "navStart" | "navEnd" | "navCold";

export interface Route {
  path: string;
  redirect?: string;
  component?: string;
  bundle?: () => Promise<any>;
  guard?: () => Observable<boolean> | Promise<boolean> | boolean;
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


const pathMatchKey = {
  delimiter: "/",
  name: "id",
  prefix: "",
  optional: true,
  partial: true,
  pattern: "",
  repeat: true,
};

let oldPath: string = "--";
const myWindow = window;


const stringToHTML =  (str: string)  => {
	var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');
	return doc.body.firstElementChild!
};


// Save lazy loaded modules in weak set
const resolved = new WeakSet();

const pendingSubject$ = new Subject<number>();

// Stores full query string
const queryStringSubject$ = new BehaviorSubject("");

// Stores latest router path
const latestRouterPathSubject$ = new BehaviorSubject<string>('');

// Function handles guards
const guardHandler = async (
  guardExist: () => boolean | Observable<boolean> | Promise<boolean>, initiator: "parent" | 'child'
) => {
  const guard = guardExist();

  //  Check if guard is an observable or promise and resolve it
  const guardResolved = isObservable(guard)
    ? await firstValueFrom(guard)
    : await Promise.resolve(guard);

  //  End function if the resolved value is false and replace path with old path
  if (!guardResolved) {
    if(initiator === 'parent') {
      myWindow.history.pushState("", "", oldPath);
    }
   
  }
  return guardResolved;
};




// Exposes navigation events
export const navigationEvents$: Observable<NavState> = pendingSubject$
  .pipe(
    scan((acc, curr) => acc + curr, 0),
    map((num) => (num === 0 ? "navEnd" : "navStart")),
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
export const outlet = (location: string) => page.show(location);

// Exposes later router path

export const latestRouterPath$ = latestRouterPathSubject$
  .asObservable()
  .pipe(shareReplay(1));




// Create lit element compoenent
export class EagRouter extends LitElement {
  constructor() {
    super();
  }

  // set div as the base element
  private element: Element =  stringToHTML('<div></div>')



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

  // This function changes routes
  async changeRoute(context: Context) {
    const elem =
      this.routes.filter((route) => route.path === context.routePath)[0] ||
      this.routes.filter((route) => route.path === "*")[0];

    // Check if there is a guard
    const guardExist = elem?.guard;

    if (guardExist) {
      const guard = await guardHandler(guardExist, "parent");

      if (!guard) {
        return;
      }
    }
    latestRouterPathSubject$.next(context.path);

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


    const  oldElem = this.element
    this.element =  stringToHTML(elem.component || '<div><div>')

    this.requestUpdate('element', oldElem)

    // Using intersection observr to check when element is loaded
    const observer = new IntersectionObserver((_) => {
      // Decrement pending count
      pendingSubject$.next(-1);
      queryStringSubject$.next(context.querystring);
      myWindow.scrollTo(0, 0);
      observer.disconnect();
    });
    observer.observe(this.element);
    oldPath = elem.path;
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

  private element: Element = stringToHTML('<div></div>')

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
      if ( path.startsWith(oldPath)) {
        return;
      }
      // Find index of element
      const index = this.routes.findIndex((route) =>
        pathToRegexp(route.path, [pathMatchKey]).test(path)
      );

      // If index exist
      if (index > -1) {
        const elem = this.routes[index];

        const guardExist = elem?.guard;

        // Check for guard
        if (guardExist) {
          const guard = await guardHandler(guardExist, "child");

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

        const  oldElem = this.element
        this.element =  stringToHTML(elem.component || '<div><div>')
     
        this.requestUpdate('element', oldElem)

        // Using intersection observer to check when element is loaded
        const observer = new IntersectionObserver((_) => {
          // Decrement pending count
          pendingSubject$.next(-1);

          myWindow.scrollTo(0, 0);
          observer.disconnect();
        });
        observer.observe(this.element);
        oldPath = path;
      }
    
    } catch (error) {
      pendingSubject$.next(1);
  
    }
  }

  render() {
    return this.element;
  }
}

customElements.define("eag-router-child", EagRouterChild);
