import { stringToHTML } from "./helper-fuctions";
export const RouterMix = (Base) => class extends Base {
    constructor() {
        super(...arguments);
        this.subScriptions = [];
        this.element = stringToHTML("<eag-router-empty></eag-router-empty>");
    }
    connectedCallback() {
        super.connectedCallback();
    }
    addToSub(sub) {
        this.subScriptions.push(sub.subscribe());
    }
    observerHandler(pageFoundSubject$, myWindow, pendingSubject$, contextQuerystring = '', queryStringSubject$ = null, parentOrchild = 'child') {
        const observer = new IntersectionObserver((_) => {
            const childRouter = this.element.querySelector("eag-router-child") ||
                this.element?.shadowRoot?.querySelector("eag-router-child");
            if (!childRouter || !childRouter?.routes?.length) {
                pageFoundSubject$.next(true);
            }
            // Decrement pending count
            pendingSubject$.next(-1);
            if (parentOrchild === 'parent') {
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
