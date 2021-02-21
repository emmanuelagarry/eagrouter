import { LitElement, html, customElement, property } from 'lit-element';
import type { Route } from './router';
import  { routerHistory } from './router';

import "./router"
import './pages/element-one'
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';


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
          guard: () => {

            return  new Promise((resolve, _) => {
              alert(false)              
              resolve(false)
            })
          }
        },
        {
          path: "/three",
          component: "<element-three></element-three>",
          bundle: () => import("../src/pages/element-three"),
        },
        {
          path: "/three/*",
          component: "<element-three></element-three>",
          bundle: () => import("../src/pages/element-three"),
        },

       
        {
          path: "*",
          component: "<page-not-found></page-not-found>",
          bundle: () => import("../src/pages/page-not-found"),
        },
      ];
  
    @property()
    bossText = 'bossText'

    connectedCallback(){
      super.connectedCallback()
      this.addEventListener('child-page-not-found', (_) => {
        // alert('page not found')
        console.log('PAGE-NOT-FOUND')
      })
    }
    routeP(){
      routerHistory.outlet('/three/three/yy')
    }


    render() {
        return html`
        <a href="/one"><button>one</button></a>   <a href="/two"><button>two</button></a>  
       
         <a href="/three"><button>three</button></a><a href="/three/three"><button>three three</button></a><a href="/three/three/yy"><button>three three three</button></a>
         <br>  <br>

         <button @click=${this.routeP}>programatic </button>
            <eag-router .routes=${this.routes}></eag-router>
        `;
    }
}