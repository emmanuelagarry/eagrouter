import { LitElement, html, customElement } from 'lit-element';
import '../index'
import type {Route} from '../index'
import {navigationEvents$} from '../index'
@customElement('app-root')

export class AppRoot extends LitElement {


     routes: Route[] = [
        {
          path: "",
          redirect: "/home",
        },
      
        {
          path: "/home",
          component: "home-page",
          bundle: () => import("./home"),
        },
        
      ];

      firstUpdated(){
        navigationEvents$.subscribe(navigationEvents => console.log(navigationEvents))
      }

    render() {
        return html`<div>
            Hello world
<eag-router .routes=${this.routes}></eag-router>


        </div>`;
    }
}