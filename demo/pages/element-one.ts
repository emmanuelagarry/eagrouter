import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { styles } from "../css";
@customElement("element-one")
export class ElementOne extends LitElement {
  static styles = styles
  @property()
  name = "element-one";

  propTest;

  connectedCallback() {
    super.connectedCallback();
    console.log({propTest: this.propTest})
    console.log(sessionStorage.getItem("emmanuel"));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  myFunction() {}
  render() {
    return html`
      <!-- <style>
    .tester{
          border: 2px solid yellow
        }</style> -->

      <button class="tester" @click=${this.myFunction}>one</button>
    `;
  }
}
