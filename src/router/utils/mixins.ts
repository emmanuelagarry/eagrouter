import type { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import type { EagRouterChild, Route } from "..";
  import { stringToHTML, routStringFormatter} from "./helper-fuctions";

type Constructor<T = any> = new (...args: any[]) => T;

export const RouterMix = <T extends Constructor>(Base: T) =>
  class extends Base {
    subScriptions: Subscription[] = [];
    routes: Route[] = [];
    element: Element = stringToHTML("<eag-router-empty></eag-router-empty>");
    connectedCallback() {
      super.connectedCallback();
    }

    addToSub(sub: Observable<any>) {
      this.subScriptions.push(sub.subscribe());
    }

    // Resolve bundle if bundle exist and also reolve component.
    async resolveBundle(elem: Route, resolved: WeakSet<object>) {
      // Resolve bundle if bundle exist.
      if (elem?.bundle) {
        if (!resolved.has(elem.bundle())) {
          await elem.bundle();
        }
      }
      // Create new element and update element

      const oldElem = this.element;
      this.element = stringToHTML(elem.component!);
      this.requestUpdate("element", oldElem);
      return this.element;
    }

    observerHandler(
      theElement: Element,
      pageFoundSubject$: BehaviorSubject<boolean>,
      myWindow: Window,
      pendingSubject$: Subject<number>,
      contextQuerystring: string = "",
      queryStringSubject$: BehaviorSubject<string> | null = null,
      parentOrchild: "parent" | "child" = "child"
    ) {
      const observer = new IntersectionObserver((_) => {
        const childRouter =
          theElement.querySelector<EagRouterChild>("eag-router-child") ||
          theElement?.shadowRoot?.querySelector<EagRouterChild>(
            "eag-router-child"
          );

        if (childRouter === null || childRouter === undefined) {
          pageFoundSubject$.next(true);
        } 
        // Decrement pending count
        pendingSubject$.next(-1);
        if (parentOrchild === "parent") {
          queryStringSubject$?.next(contextQuerystring);
        }
        myWindow.scrollTo(0, 0);
        observer.disconnect();
      });
      observer.observe(theElement);
    }

    disconnectedCallback() {
      this.subScriptions.forEach((sub) => sub.unsubscribe());
      super.disconnectedCallback();
    }
  };
