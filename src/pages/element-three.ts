import { LitElement, html, property } from "lit-element";


export class ElementThree extends LitElement {
  @property()
  name = "element-three";
  render() {
    return html`
    <p>three</p>`;
  }
}
customElements.define('element-three', ElementThree)
