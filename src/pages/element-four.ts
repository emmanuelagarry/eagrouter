import { LitElement, html, customElement } from 'lit-element';

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