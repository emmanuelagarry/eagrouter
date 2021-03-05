import type { LitElement } from "lit-element";
import type { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import type { EagRouterChild } from "..";
import { stringToHTML } from "./helper-fuctions";

type Constructor<T = any> = new (...args: any[]) => T;

export const RouterMix = <T extends Constructor>(Base: T) =>
  class extends Base {

    subScriptions: Subscription[] = [];
    element: Element = stringToHTML(
        "<eag-router-empty></eag-router-empty>"
      )

      connectedCallback() {
        super.connectedCallback();
      }

      addToSub(sub: Observable<any>){
        this.subScriptions.push(sub.subscribe());
      }

      observerHandler(pageFoundSubject$: BehaviorSubject<boolean>, myWindow: Window, pendingSubject$: Subject<number>, contextQuerystring: string = '', queryStringSubject$: BehaviorSubject<string> | null = null, parentOrchild : 'parent'|'child' = 'child'){
        const observer = new IntersectionObserver((_) => {
            const childRouter =
              this.element.querySelector<EagRouterChild>("eag-router-child") ||
              this.element?.shadowRoot?.querySelector<EagRouterChild>(
                "eag-router-child"
              );
    
            if (!childRouter || !childRouter?.routes?.length) {
              pageFoundSubject$.next(true);
            }
    
            // Decrement pending count
            pendingSubject$.next(-1);
            if(parentOrchild === 'parent'){
                queryStringSubject$?.next(contextQuerystring);
            }
            myWindow.scrollTo(0, 0);
            observer.disconnect();
          });
          observer.observe(this.element);
      }

      disconnectedCallback() {
        this.subScriptions.forEach((sub) => sub.unsubscribe());
        super.disconnectedCallback();
      }


  };
