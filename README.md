# This is the coolest web component router

## More documentation coming up later!!!

Eagrouter is an easy to use component router for custom elements. It works just like any other custom element. It takes in 2 properties, a route configuration object and an optional route base string. Eagrouter is really a wrapper around [Pagejs](https://github.com/visionmedia/page.js) which is a tiny express-inspired client-side router; if you like pagejs, then you would like Eagrouter. It uses almost all the same api's for declaring routes as pagejs . It also uses rxjs for reactivity and LitElement for handling custom elements. This three libraries combined together makes the router awseome to use.

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

Use as a normal html tag in your project root, and provide your route config.

This example uses lit-element as a base class. But it works with other web component libraries also.

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
      component: "<home-page></home-page>",
      path: "/home",
    },

  
//   For pages with lazyloading, use like this
    {
      component: "<products-page></products-page>",
      path: "/products",
      bundle: () => import("./pages/products"),
    },

// Use * to match multiple paths
     {
      component: "<products-page></products-page>",
// Mathes all products path because of * symbol
      path: "/products/*",
      bundle: () => import("./pages/products"),
    },

    // use * for pages with routes that don't match.
    {
      path: "*",
      component: "<page-not-found></page-not-found>",
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

You can import these other things from eagrouter. More documentation coming soon.

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

For child paths, use the router child element in the parent component.
```html
<eag-router-child></eag-router-child>
```
---
```javascript
// ..........


export class ProductsPage extends LitElement {

  // Use the full path to reference the child component.

  routes = [
    {
      component: "<products-page-one></products-page-one>",
    
      path: "/products/pageone",
    },
     {
      component: "<products-page-two></products-page-two>",
      path: "/products/pagetwo",
    },
  ];

  render() {
    return html`<eag-router-child .routes=${this.routes}></eag-router-child>`;
  }
}

customElements.define("products-page", ProductsPage);
```
<br>

> ## Router Guards


To guard a path; add a guard property to the object in the array. The property should return a boolean value. It can also take an observable or promise that returns a boolean value

```javascript
// This function just returns a regular promise
const ireturnAPromise = () => {
  const myFirstPromise = new Promise((resolve, reject) => {
    resolve(true) 
  })
return myFirstPromise
}
```

```javascript
// ............
    {
      component: "<somepage-page></somepage-page>",
      path: "/products/xy",
      guard: () => false 
    },
    {
      component: "<somepage2-page></somepage2-page>",
      path: "/products/xyz",
      guard: () => ireturnAPromise()
    },
    {
      component: "<somepage3-page></somepage3-page>",
      path: "/products/xyz2",
      guard: () => of(true)
    }

```

 You can find me on linkedin to ask for more info. This project is stable but is in aplha state for now.
https://www.linkedin.com/in/emmanuel-agarry-a22931122/