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
exports.EagRouter = exports.param$ = exports.queryString$ = exports.navigationEvents$ = void 0;
var lit_element_1 = require("lit-element");
var page_1 = require("page");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
// This saved bundle that had been lazy loaded
var resolved = new WeakSet();
// Navigation Behavoir sunject
var navigationEventsSubject$ = new rxjs_1.BehaviorSubject("navCold");
exports.navigationEvents$ = navigationEventsSubject$.asObservable();
// Query string Subject
var queryStringSubject$ = new rxjs_1.BehaviorSubject("");
//  This fucnction exposes the query string
exports.queryString$ = queryStringSubject$.pipe(operators_1.distinctUntilChanged(), operators_1.publishReplay(1), operators_1.refCount());
// This function exposes the query parameters
var param$ = function (id) {
    return exports.queryString$.pipe(operators_1.map(function (query) { return new URLSearchParams(query).get(id); }));
};
exports.param$ = param$;
var EagRouter = /** @class */ (function (_super) {
    __extends(EagRouter, _super);
    function EagRouter() {
        var _this = _super.call(this) || this;
        _this.element = document.createElement("div");
        _this.myWindow = window;
        //  Saves on path navigated to
        _this.oldPath = null;
        //   Property Holding routes
        _this.routes = [];
        //   This exposes the shadow root of the element
        // This property saved the base path of the element
        _this.basePath = "";
        return _this;
    }
    EagRouter.prototype.createRenderRoot = function () {
        return this;
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
        page_1["default"].base(this.basePath);
        page_1["default"]();
    };
    EagRouter.prototype.firstUpdated = function () {
        // Install routes on first updated
        this.installRoute();
    };
    EagRouter.prototype.changeRoute = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var elem, oldElement;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        elem = this.routes.filter(function (route) { return route.path === context.routePath; })[0] ||
                            this.routes.filter(function (route) { return route.path === "*"; })[0];
                        if (this.oldPath === elem.path) {
                            return [2 /*return*/];
                        }
                        navigationEventsSubject$.next("navStart");
                        if (!elem.bundle) return [3 /*break*/, 2];
                        if (!!resolved.has(elem.bundle())) return [3 /*break*/, 2];
                        return [4 /*yield*/, elem.bundle()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!customElements.get(elem.component || "")) {
                            navigationEventsSubject$.next("navEnd");
                            throw new Error("Cant find Element");
                        }
                        oldElement = this.element;
                        // Create new cpmponent. Create empty element if undefined. This check is for satisifying typescripts compiler
                        this.element = document.createElement(elem.component || "");
                        this.requestUpdate("element", oldElement);
                        // Listen for event web component ready. This event is used to detect navigation end.
                        this.element.addEventListener("WebComponentsReady", function (_) {
                            navigationEventsSubject$.next("navEnd");
                            queryStringSubject$.next(context.querystring);
                            _this.myWindow.scrollTo(0, 0);
                        });
                        // Change old path
                        this.oldPath = elem.path;
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
    __decorate([
        lit_element_1.property()
    ], EagRouter.prototype, "basePath");
    return EagRouter;
}(lit_element_1.LitElement));
exports.EagRouter = EagRouter;
customElements.define('eag-router', EagRouter);
