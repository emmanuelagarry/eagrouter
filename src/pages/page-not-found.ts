import { LitElement, html, customElement } from "lit-element";

@customElement("page-not-found")
export class PageNotFound extends LitElement {
  render() {
    return html` <h1>Page not found</h1>`;
  }
}
