import { spy, stub } from "sinon";
import { expect, fixture, html, assert } from "@open-wc/testing";

import "../src/router/index";
import "../src/pages/element-one";
import "../src/pages/element-three";

import { EagRouter, Route } from "../src/router/index";

const routes: Route[] = [
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
  },
];

describe("Router test", () => {
  // Check if router element exist and install routes
  describe("Eag Router exist's", () => {
    let el: EagRouter;
    before(async () => {
      el = await fixture(html` <eag-router .routes=${routes}></eag-router>`);
    });

    it("Should install route and route to path 'one'", async () => {
      const promise = new Promise((resolve, _) => {
        setTimeout(() => {
          resolve(123);
        }, 1500);
      });
      await promise;
      expect(window.location.href).to.equal("http://localhost:8000/one");
    });

    // playwrightLauncher().getPage('')
  });

  // Check if router shows right view

  describe("Eag Router View", () => {
    let el: EagRouter;
    beforeEach(async () => {
      el = await fixture(html`<eag-router .routes=${routes}></eag-router>`);
    });

    // Router should render non lazy loaded route
    it("should render non lazy loaded element", async () => {
      // @ts-ignore
      await el.changeRoute({ routePath: "/three" });

      const promise = new Promise((resolve, _) => {
        setTimeout(() => {
          resolve(123);
        }, 1000);
      });
      await promise;
      const elemenName = el.render();
      const renderedElement = await fixture(
        html`<element-three></element-three>`
      );
      assert.strictEqual(elemenName.nodeName, renderedElement.nodeName);
    });

    // Router should render lazy loaded route
    it("should render lazy loaded element", async () => {
      
      // @ts-ignore
      await el.changeRoute({ routePath: "/two" });
      const promise = new Promise((resolve, _) => {
        setTimeout(() => {
          resolve(123);
        }, 1000);
      });
      await promise;
      const elemenName = el.render();
      const renderedElement = await fixture(html`<element-two></element-two>`);
      assert.strictEqual(elemenName.nodeName, renderedElement.nodeName);
    });
  });
});
