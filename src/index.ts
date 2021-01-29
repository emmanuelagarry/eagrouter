import { LitElement, property } from "lit-element";



import page from "page";
import {
  BehaviorSubject,
  Subject,
} from "rxjs";
import type { Subscription, Observable } from "rxjs";
import {
  distinctUntilChanged,
  map,
  shareReplay,
  tap,
  scan,
} from "rxjs/operators";


import { pathToRegexp } from "./utils/path-to-regex";
import { guardHandler, pathMatchKey, stringToHTML } from "./utils/helper-fuctions";
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






let oldPath: string = "";
let oldpathChild: string = "";
const myWindow = window;




// Save lazy loaded modules in weak set
const resolved = new WeakSet();

const pendingSubject$ = new Subject<number>();

// Stores full query string
const queryStringSubject$ = new BehaviorSubject("");

// Stores latest router path
const latestRouterPathSubject$ = new BehaviorSubject<string>('');

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


// Create lit element componenent
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
    latestRouterPathSubject$.next(context.pathname);

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


    const oldElem = this.element
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
      if ( path.startsWith(oldpathChild)) {
        return;
      }
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
        } else {
          console.log('page not found')
          // Go to page not found
          // page.show('*')
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
        oldpathChild = path;
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
