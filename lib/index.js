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
import page from "page";
import { BehaviorSubject, Subject } from "rxjs";
import { distinctUntilChanged, map, shareReplay, tap, scan, } from "rxjs/operators";
import { pathToRegexp } from "./path-to-regex";
// Save lazy loaded modules in weak set
const resolved = new WeakSet();
const pendingSubject$ = new Subject();
export const navigationEvents$ = pendingSubject$
    .asObservable()
    .pipe(scan((acc, curr) => acc + curr, 0), map((num) => (num === 0 ? "navEnd" : "navStart")), shareReplay());
const queryStringSubject$ = new BehaviorSubject("");
export const queryString$ = queryStringSubject$.pipe(distinctUntilChanged(), shareReplay());
export const param$ = (id) => queryString$.pipe(map((query) => new URLSearchParams(query).get(id)));
export const outlet = (location) => page.show(location);
const latestRouterPathSubject$ = new BehaviorSubject(null);
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
        this.element = document.createElement("div");
        this.myWindow = window;
        this.oldPath = null;
        this.pending = true;
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
    async changeRoute(context) {
        latestRouterPathSubject$.next(context.path);
        const elem = this.routes.filter((route) => route.path === context.routePath)[0] ||
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
    currentView() { }
    render() {
        return this.element;
    }
}
__decorate([
    property(),
    __metadata("design:type", Object)
], EagRouter.prototype, "pending", void 0);
__decorate([
    property(),
    __metadata("design:type", Array)
], EagRouter.prototype, "routes", void 0);
customElements.define("eag-router", EagRouter);
export class EagRouterChild extends LitElement {
    constructor() {
        super();
        this.element = document.createElement("div");
        this.myWindow = window;
        this.oldPath = null;
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
            if (this.oldPath && path.startsWith(this.oldPath)) {
                return;
            }
            const index = this.routes.findIndex((route) => pathToRegexp(route.path, [pathMatchKey]).test(path));
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
        }
        catch (error) {
            pendingSubject$.next(1);
        }
    }
    currentView() { }
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
