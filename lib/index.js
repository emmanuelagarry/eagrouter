var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { LitElement, property } from 'lit-element';
import page from 'page';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map, publishReplay, refCount, scan, } from 'rxjs/operators';
const resolved = new WeakSet();
const navigationEventsSubject$ = new BehaviorSubject('navCold');
export const navigationEvents$ = navigationEventsSubject$.asObservable();
const pendingSubject$ = new BehaviorSubject(-1);
export const pending$ = pendingSubject$.pipe(scan((acc, curr) => acc + curr, 0), map((num) => (num === 0 ? true : false)), distinctUntilChanged());
const queryStringSubject$ = new BehaviorSubject('');
export const queryString$ = queryStringSubject$.pipe(distinctUntilChanged(), publishReplay(1), refCount());
const param$ = (id) => queryString$.pipe(map((query) => new URLSearchParams(query).get(id)));
export class EagRouter extends LitElement {
    constructor() {
        super();
        this.element = document.createElement('div');
        this.myWindow = window;
        this.oldPath = null;
        this.pending = true;
        this.routes = [];
    }
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
        page.base('');
        page();
    }
    firstUpdated() {
        this.installRoute();
    }
    async changeRoute(context) {
        const elem = this.routes.filter((route) => route.path === context.routePath)[0] ||
            this.routes.filter((route) => route.path === '*')[0];
        if (this.oldPath === elem.path) {
            return;
        }
        navigationEventsSubject$.next('navStart');
        if (elem.bundle) {
            if (!resolved.has(elem.bundle())) {
                await elem.bundle();
            }
        }
        if (!customElements.get(elem.component || '')) {
            navigationEventsSubject$.next('navEnd');
            throw new Error('Cant find Element');
        }
        const oldElement = this.element;
        this.element = document.createElement(elem.component || '');
        this.requestUpdate('element', oldElement);
        this.requestUpdate();
        const observer = new IntersectionObserver((_) => {
            navigationEventsSubject$.next('navEnd');
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
customElements.define('eag-router', EagRouter);
