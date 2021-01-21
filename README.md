# This is the coolest web component router

## More documentation coming up later!!!

#### Eagrouter is an easy to use component router for custom elements. It works just like any other custom element. It takes in 2 properties, a route configuration object and an optional route base string. Eagrouter is really a wrapper around [Pagejs](https://github.com/visionmedia/page.js) which is a tiny express-inspired client-side router; if you like pagejs, then you would like Eagrouter. It uses almost all the same api's for declaring routes as pagejs . It also uses rxjs for reactivity and LitElement for handling custom elements. This three libraries combined together makes the router awseome to use. Check out the unpacked size, it is smaller than most client side router out there!!!

---

> ## Installation

<!-- Code blocks -->

```bash
npm install eagrouter

```

> ## Usage

```javascript
import "eagrouter";
```

> #### Use as a normal html tag in your project root, and provide your route config.

---

> #### This example uses lit-element as a base class. But it works with other web component libraries also.

```javascript
import { LitElement, html } from "lit-element";

export class AppRoot extends LitElement {
  routes = [
    {
      path: "/",
      redirect: "/home",
    },

    //   For pages without lazyloading, use like this
    {
      component: "home-page",
      path: "/home",
    },

    //   For pages with lazyloading, use like this
    {
      component: "products-page",
      path: "/products",
      bundle: () => import("./pages/products"),
    },

    // use * for pages with routes that dont match.
    {
      path: "*",
      component: "page-not-found",
      bundle: () => import("./pages/page-not-found"),
    },
  ];

  render() {
    return html`<eag-router .routes=${this.routes}></eag-router>`;
  }
}

customElements.define("app-root", AppRoot);
```

---

> #### You can import these other things from eagrouter. More documentation coming soon.

```javascript
import { Route, navigationEvents$, NavState, queryString$, param$ } from "eagrouter";
```

```javascript

// "queryString$, navigationEvents$ and param$" are just regular observables.




// Use this to get the full query string when making http requests 

queryString$.subscribe(fullQuery => {

   console.log(queryString)
})




// Use this to get the current navigation state. 
// Use "NavState" to know the type of navigation available
navigationEvents$.subscribe(navState => {
   console.log(queryString)
})



// Get a specific query param like this 
param$('someId').subscribe(param => {
   console.log(param)
})



```

> You can find me on linkedin to ask for more info. This project is stable but is in aplha state for now.
https://www.linkedin.com/in/emmanuel-agarry-a22931122/