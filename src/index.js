"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.EagRouterChild = exports.EagRouter = exports.latestRouterPath$ = exports.outlet = exports.param$ = exports.queryString$ = exports.navigationEvents$ = void 0;
var lit_element_1 = require("lit-element");
var page_1 = require("page");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var path_to_regex_1 = require("./utils/path-to-regex");
var helper_fuctions_1 = require("./utils/helper-fuctions");
var oldPath = "";
var oldpathChild = "";
var myWindow = window;
// Save lazy loaded modules in weak set
var resolved = new WeakSet();
var pendingSubject$ = new rxjs_1.Subject();
// Stores full query string
var queryStringSubject$ = new rxjs_1.BehaviorSubject("");
// Stores latest router path
var latestRouterPathSubject$ = new rxjs_1.BehaviorSubject('');
// Exposes navigation events
exports.navigationEvents$ = pendingSubject$
    .pipe(operators_1.scan(function (acc, curr) { return acc + curr; }, 0), operators_1.map(function (num) { return (num === 0 ? "navEnd" : "navStart"); }), operators_1.shareReplay(1));
// Exposes full query string 
exports.queryString$ = queryStringSubject$.pipe(operators_1.distinctUntilChanged(), operators_1.shareReplay(1));
// Exposes query string of particular element
var param$ = function (id) {
    return exports.queryString$.pipe(operators_1.map(function (query) { return new URLSearchParams(query).get(id); }));
};
exports.param$ = param$;
// exposes page router for navigating programatically
var outlet = function (location) { return page_1["default"].show(location); };
exports.outlet = outlet;
// Exposes later router path
exports.latestRouterPath$ = latestRouterPathSubject$
    .asObservable()
    .pipe(operators_1.shareReplay(1));
// Create lit element componenent
var EagRouter = /** @class */ (function (_super) {
    __extends(EagRouter, _super);
    function EagRouter() {
        var _this = _super.call(this) || this;
        // set div as the base element
        _this.element = helper_fuctions_1.stringToHTML('<div></div>');
        _this.routes = [];
        return _this;
    }
    EagRouter.prototype.createRenderRoot = function () {
        return this;
    };
    // Install routes
    EagRouter.prototype.firstUpdated = function () {
        this.installRoute();
    };
    EagRouter.prototype.installRoute = function () {
        var _this = this;
        this.routes.forEach(function (route) {
            if (route.redirect) {
                page_1["default"].redirect(route.path, route.redirect);
                return;
            }
            page_1["default"](route.path, function (context) {
                _this.changeRoute(context);
            });
        });
        page_1["default"].base("");
        page_1["default"]();
    };
    // This function changes routes
    EagRouter.prototype.changeRoute = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var elem, guardExist, guard, oldElem, observer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        elem = this.routes.filter(function (route) { return route.path === context.routePath; })[0] ||
                            this.routes.filter(function (route) { return route.path === "*"; })[0];
                        guardExist = elem === null || elem === void 0 ? void 0 : elem.guard;
                        if (!guardExist) return [3 /*break*/, 2];
                        return [4 /*yield*/, helper_fuctions_1.guardHandler(guardExist, "parent")];
                    case 1:
                        guard = _a.sent();
                        if (!guard) {
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        latestRouterPathSubject$.next(context.pathname);
                        if (oldPath.startsWith(elem.path)) {
                            return [2 /*return*/];
                        }
                        pendingSubject$.next(1);
                        if (!(elem === null || elem === void 0 ? void 0 : elem.bundle)) return [3 /*break*/, 4];
                        if (!!resolved.has(elem.bundle())) return [3 /*break*/, 4];
                        return [4 /*yield*/, elem.bundle()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        oldElem = this.element;
                        this.element = helper_fuctions_1.stringToHTML(elem.component || '<div><div>');
                        this.requestUpdate('element', oldElem);
                        observer = new IntersectionObserver(function (_) {
                            // Decrement pending count
                            pendingSubject$.next(-1);
                            queryStringSubject$.next(context.querystring);
                            myWindow.scrollTo(0, 0);
                            observer.disconnect();
                        });
                        observer.observe(this.element);
                        oldPath = elem.path;
                        return [2 /*return*/];
                }
            });
        });
    };
    EagRouter.prototype.render = function () {
        return this.element;
    };
    __decorate([
        lit_element_1.property()
    ], EagRouter.prototype, "routes");
    return EagRouter;
}(lit_element_1.LitElement));
exports.EagRouter = EagRouter;
customElements.define("eag-router", EagRouter);
//  Child router
var EagRouterChild = /** @class */ (function (_super) {
    __extends(EagRouterChild, _super);
    function EagRouterChild() {
        var _this = _super.call(this) || this;
        _this.element = helper_fuctions_1.stringToHTML('<div></div>');
        _this.subScriptions = [];
        _this.latestPath$ = exports.latestRouterPath$.pipe(operators_1.tap(function (route) {
            if (route) {
                _this.renderView(route);
            }
        }));
        _this.routes = [];
        _this.initialPath = null;
        return _this;
    }
    EagRouterChild.prototype.createRenderRoot = function () {
        return this;
    };
    EagRouterChild.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.subScriptions.push(this.latestPath$.subscribe());
    };
    EagRouterChild.prototype.disconnectedCallback = function () {
        this.subScriptions.forEach(function (sub) { return sub.unsubscribe(); });
        _super.prototype.disconnectedCallback.call(this);
    };
    EagRouterChild.prototype.renderView = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var index, elem, guardExist, guard, oldElem, observer_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (path.startsWith(oldpathChild)) {
                            return [2 /*return*/];
                        }
                        index = this.routes.findIndex(function (route) {
                            return path_to_regex_1.pathToRegexp(route.path, [helper_fuctions_1.pathMatchKey]).test(path);
                        });
                        if (!(index > -1)) return [3 /*break*/, 6];
                        elem = this.routes[index];
                        guardExist = elem === null || elem === void 0 ? void 0 : elem.guard;
                        if (!guardExist) return [3 /*break*/, 2];
                        return [4 /*yield*/, helper_fuctions_1.guardHandler(guardExist, "child")];
                    case 1:
                        guard = _a.sent();
                        if (!guard) {
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        console.log('page not found');
                        _a.label = 3;
                    case 3:
                        //increment pending count
                        pendingSubject$.next(1);
                        if (!(elem === null || elem === void 0 ? void 0 : elem.bundle)) return [3 /*break*/, 5];
                        if (!!resolved.has(elem.bundle())) return [3 /*break*/, 5];
                        return [4 /*yield*/, elem.bundle()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        oldElem = this.element;
                        this.element = helper_fuctions_1.stringToHTML(elem.component || '<div><div>');
                        this.requestUpdate('element', oldElem);
                        observer_1 = new IntersectionObserver(function (_) {
                            // Decrement pending count
                            pendingSubject$.next(-1);
                            myWindow.scrollTo(0, 0);
                            observer_1.disconnect();
                        });
                        observer_1.observe(this.element);
                        oldpathChild = path;
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        pendingSubject$.next(1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    EagRouterChild.prototype.render = function () {
        return this.element;
    };
    __decorate([
        lit_element_1.property()
    ], EagRouterChild.prototype, "routes");
    __decorate([
        lit_element_1.property()
    ], EagRouterChild.prototype, "initialPath");
    return EagRouterChild;
}(lit_element_1.LitElement));
exports.EagRouterChild = EagRouterChild;
customElements.define("eag-router-child", EagRouterChild);
