import {  spy } from "sinon";
import { expect, fixture, html, assert } from "@open-wc/testing";

import "../src/index";
import "./element-one";

import { EagRouter, Route } from "../src/index";

const routes: Route[] = [
  {
    path: "",
    redirect: "/one",
  },

  {
    path: "/one",
    component: "element-one",
  },

  {
    path: "/two",
    component: "element-two",
    bundle: () => import("./element-two"),
  },
];

describe("Router test", () => {
  // Check if router element exist and install routes
  describe("Eag Router exist's", () => {
    let el: EagRouter;
    before(async () => {
      el = await fixture(html` <eag-router></eag-router> `);
    });
    it("Should install routes", async () => {
      const installRoutesSpy = spy(el, "installRoute");
      el.firstUpdated();
      expect(installRoutesSpy).to.have.callCount(1);
    });
  });

  // Check if router shows right view

  describe("Eag Router View", () => {
    let el: EagRouter;
    beforeEach(async () => {
      el = await fixture(html` <eag-router .routes=${routes}></eag-router> `);
    });
    it("should call changeRoute", async () => {
      const changeRoutStub = spy(el, "changeRoute");
      await el.updateComplete
      const promise = new Promise((resolve, _) => {
        setTimeout(() => {
          resolve(123);
        }, 1000);
      });
      await promise;
      expect(changeRoutStub).to.have.callCount(1);
    });

    // Router should render non lazy loaded route
    it("should render non lazy loaded element", async () => {
      
      // @ts-ignore
      await el.changeRoute({routePath: '/one'})
      const promise = new Promise((resolve, _) => {
        setTimeout(() => {
          resolve(123);
        }, 1500);
      });
      await promise;
      const elemenName = el.render();
      const renderedElement = await fixture(html`<element-one></element-one>`);
      assert.strictEqual(elemenName.nodeName, renderedElement.nodeName);
    });

    // Router should render lazy loaded route
    it("should render lazy loaded element", async () => {

            // @ts-ignore

      await el.changeRoute({routePath: '/two'})
    
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
