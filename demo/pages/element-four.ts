import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
@customElement('element-four')
export class ElementFour extends LitElement {


    render() {
        return html`
        <p>
        element 4
        </p>
        `;
    }
}