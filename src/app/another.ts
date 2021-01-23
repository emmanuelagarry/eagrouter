import { LitElement, html, customElement } from 'lit-element';

@customElement('another-page')
export class Another extends LitElement {

 

    render() {
        return html` <p>I am another page</p>`;
    }
}