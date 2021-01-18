import { LitElement, html, customElement, property } from "lit-element";

@customElement("element-one")
export class ElementOne extends LitElement {
  @property()
  name = "element-one";
  myFunction() {}
  render() {
    return html` <button @click=${this.myFunction}>click</button> `;
  }
}
