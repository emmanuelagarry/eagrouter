import { stringToHTML } from "./helper-fuctions";
export const RouterMix = (Base) => class extends Base {
    constructor() {
        super(...arguments);
        this.subScriptions = [];
        this.routes = [];
        this.element = stringToHTML("<eag-router-empty></eag-router-empty>");
    }
    connectedCallback() {
        super.connectedCallback();
    }
    addSub(sub) {
        this.subScriptions.push(sub);
    }
    // Resolve bundle if bundle exist and also reolve component.
    async resolveBundle(elem, resolved) {
        // Resolve bundle if bundle exist.
        if (elem?.bundle) {
            if (!resolved.has(elem.bundle())) {
                await elem.bundle();
            }
        }
        // Create new element and update element
        const oldElem = this.element;
        const result = stringToHTML(elem.component);
        if (elem.props) {
            elem.props.forEach(prop => {
                result[prop.key] = prop.value;
            });
        }
        this.element = result;
        this.requestUpdate("element", oldElem);
        return this.element;
    }
    observerHandler(theElement, pageFoundSubject$, pendingSubject$, contextQuerystring = "", queryStringSubject$ = null, parentOrchild = "child") {
        const observer = new IntersectionObserver((_) => {
            const childRouter = theElement.querySelector("eag-router-child") ||
                theElement?.shadowRoot?.querySelector("eag-router-child");
            if (childRouter === null || childRouter === undefined) {
                pageFoundSubject$.next(true);
            }
            // Decrement pending count
            pendingSubject$.next(-1);
            if (parentOrchild === "parent") {
                queryStringSubject$?.next(contextQuerystring);
            }
            this.scrollTop = 0;
            observer.disconnect();
        });
        observer.observe(theElement);
    }
    disconnectedCallback() {
        this.subScriptions.forEach((sub) => sub.unsubscribe());
        super.disconnectedCallback();
    }
};
