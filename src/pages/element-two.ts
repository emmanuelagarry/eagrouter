import { LitElement, html, property } from "lit-element";


export class ElementTwo extends LitElement {
  @property()
  name = "element-two";

  render() {
    return html`<p>two</p>`;
  }
}
customElements.define('element-two', ElementTwo)
