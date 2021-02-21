import { LitElement, html, customElement, css, property } from "lit-element";
import { styles } from "../css";
@customElement("element-one")
export class ElementOne extends LitElement {


  static get styles() {
  
    return [styles];
      
    
  }
  @property()
  name = "element-one";

  connectedCallback(){
    super.connectedCallback()
    console.log(sessionStorage.getItem('emmanuel'))
  }
  disconnectedCallback(){
    super.disconnectedCallback()
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
