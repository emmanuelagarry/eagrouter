import { LitElement, html, customElement, property } from "lit-element";

@customElement("element-two")
export class ElementTwo extends LitElement {
  @property()
  name: "element-two";

  render() {
    return html``;
  }
}
