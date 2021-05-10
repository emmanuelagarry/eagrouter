import { LitElement, html} from "lit";
import { customElement } from "lit/decorators.js";

@customElement("page-not-found")
export class PageNotFound extends LitElement {
  render() {
    return html` <h1>Page not found</h1>`;
  }
}
