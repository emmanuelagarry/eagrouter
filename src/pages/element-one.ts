import { LitElement, html, customElement, property } from "lit-element";

@customElement("element-one")
export class ElementOne extends LitElement {
  @property()
  name = "element-one";

  connectedCallback(){
    super.connectedCallback()
    console.log(sessionStorage.getItem('emmanuel'))
  }
  myFunction() {}
  render() {
    return html` <button @click=${this.myFunction}>one</button>
    
    `;
  }
}
