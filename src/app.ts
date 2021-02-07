import { LitElement, html, customElement, property } from 'lit-element';

@customElement('app-root')
export class App extends LitElement {

  
    @property()
    bossText = 'bossText'

    render() {
        return html`<p>

        </p>`;
    }
}