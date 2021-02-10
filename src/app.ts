import { LitElement, html, customElement, property } from 'lit-element';
import type { Route } from './router';
import "./router"
import './pages/element-one'

@customElement('app-root')
export class App extends LitElement {


     routes: Route[] = [
        {
          path: "",
          redirect: "/one",
        },
      
        {
          path: "/one",
          component: "<element-one></element-one>",
        },
      
        {
          path: "/two",
          component: "<element-two></element-two>",
          bundle: () => import("../src/pages/element-two"),
        },
        {
          path: "/three",
          component: "<element-three></element-three>",
          bundle: () => import("../src/pages/element-three"),
        },
      ];
  
    @property()
    bossText = 'bossText'

    render() {
        return html`
        <a href="/one"><button>one</button></a>   <a href="two"><button>two</button></a>  
       
         <a href="three"><button>three</button></a>
         <br>  <br>
            <eag-router .routes=${this.routes}></eag-router>
        `;
    }
}