var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { LitElement, property } from "lit-element";
import "lit-html";
import page from "page";
import { BehaviorSubject, Subject, isObservable, firstValueFrom, } from "rxjs";
import { distinctUntilChanged, map, shareReplay, tap, scan, } from "rxjs/operators";
import { pathToRegexp } from "./path-to-regex";
const pathMatchKey = {
    delimiter: "/",
    name: "id",
    prefix: "",
    optional: true,
    partial: true,
    pattern: "",
    repeat: true,
};
let oldPath = "--";
const myWindow = window;
const stringToHTML = (str) => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body.firstElementChild;
};
// Save lazy loaded modules in weak set
const resolved = new WeakSet();
const pendingSubject$ = new Subject();
// Stores full query string
const queryStringSubject$ = new BehaviorSubject("");
// Stores latest router path
const latestRouterPathSubject$ = new BehaviorSubject('');
// Function handles guards
const guardHandler = async (guardExist, initiator) => {
    const guard = guardExist();
    //  Check if guard is an observable or promise and resolve it
    const guardResolved = isObservable(guard)
        ? await firstValueFrom(guard)
        : await Promise.resolve(guard);
    //  End function if the resolved value is false and replace path with old path
    if (!guardResolved) {
        if (initiator === 'parent') {
            myWindow.history.pushState("", "", oldPath);
        }
    }
    return guardResolved;
};
// Exposes navigation events
export const navigationEvents$ = pendingSubject$
    .pipe(scan((acc, curr) => acc + curr, 0), map((num) => (num === 0 ? "navEnd" : "navStart")), shareReplay(1));
// Exposes full query string 
export const queryString$ = queryStringSubject$.pipe(distinctUntilChanged(), shareReplay(1));
// Exposes query string of particular element
export const param$ = (id) => queryString$.pipe(map((query) => new URLSearchParams(query).get(id)));
// exposes page router for navigating programatically
export const outlet = (location) => page.show(location);
// Exposes later router path
export const latestRouterPath$ = latestRouterPathSubject$
    .asObservable()
    .pipe(shareReplay(1));
// Create lit element compoenent
export class EagRouter extends LitElement {
    constructor() {
        super();
        // set div as the base element
        this.element = stringToHTML('<div></div>');
        this.routes = [];
    }
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
    async changeRoute(context) {
        const elem = this.routes.filter((route) => route.path === context.routePath)[0] ||
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
        const oldElem = this.element;
        this.element = stringToHTML(elem.component || '<div><div>');
        this.requestUpdate('element', oldElem);
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
__decorate([
    property(),
    __metadata("design:type", Array)
], EagRouter.prototype, "routes", void 0);
customElements.define("eag-router", EagRouter);
//  Child router
export class EagRouterChild extends LitElement {
    constructor() {
        super();
        this.element = stringToHTML('<div></div>');
        this.subScriptions = [];
        this.latestPath$ = latestRouterPath$.pipe(tap((route) => {
            if (route) {
                this.renderView(route);
            }
        }));
        this.routes = [];
        this.initialPath = null;
    }
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
    async renderView(path) {
        try {
            if (path.startsWith(oldPath)) {
                return;
            }
            // Find index of element
            const index = this.routes.findIndex((route) => pathToRegexp(route.path, [pathMatchKey]).test(path));
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
                const oldElem = this.element;
                this.element = stringToHTML(elem.component || '<div><div>');
                this.requestUpdate('element', oldElem);
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
        }
        catch (error) {
            pendingSubject$.next(1);
        }
    }
    render() {
        return this.element;
    }
}
__decorate([
    property(),
    __metadata("design:type", Array)
], EagRouterChild.prototype, "routes", void 0);
__decorate([
    property(),
    __metadata("design:type", Object)
], EagRouterChild.prototype, "initialPath", void 0);
customElements.define("eag-router-child", EagRouterChild);
