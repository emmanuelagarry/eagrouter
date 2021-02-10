import { TestScheduler } from "rxjs/testing";

import { expect, fixture, html } from "@open-wc/testing";

import "../src/router/index";
import "../src/pages/element-one";
import {
  EagRouter,
  Route,
  navigationEvents$,
  NavState,
} from "../src/router/index";
import { Subject } from "rxjs";
import {
  buffer,
  take,
  tap,
} from "rxjs/operators";

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
  let testScheduler: TestScheduler;
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal
      // e.g. using chai.
      expect(actual).deep.equal(expected);
    });
  });
  describe("Rxjs testing", () => {
    let el: EagRouter;
    before(async () => {
      el = await fixture(html` <eag-router .routes=${routes}></eag-router> `);
    });
    it("Navigation events run as expected", async () => {
      const doneSubject$ = new Subject<string>();
      const navgigationEnv: NavState[] = [];
      navigationEvents$
        .pipe(
          buffer(doneSubject$),
          tap((nav) => {
            navgigationEnv.push(...nav);
          }),
          take(1)
        )
        .subscribe();
      // @ts-ignore
      await el.changeRoute({ routePath: "/two" });
      await el.updateComplete;
      const promise = new Promise((resolve, _) => {
        setTimeout(() => {
          resolve(123);
        }, 1500);
      });
      await promise;
      doneSubject$.next("done");
  
      const expectedNavEvents: NavState[] = ["navCold", "navStart", "navEnd"];
      expect(navgigationEnv[0] && navgigationEnv[1] && navgigationEnv[2]).to.equal(
        expectedNavEvents[0] && expectedNavEvents[1] && expectedNavEvents[2]
      );
    });
  });
});
