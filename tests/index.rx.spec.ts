import { TestScheduler } from 'rxjs/testing';

import {  spy } from "sinon";
import { expect, fixture, html, assert } from "@open-wc/testing";

import "../src/index";
import "./element-one";

import { EagRouter, Route, navigationEvents$, NavState } from "../src/index";
import { BehaviorSubject, interval } from 'rxjs';
import { buffer, filter, shareReplay } from 'rxjs/operators';

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
  let testScheduler: TestScheduler
  beforeEach(() => {
     testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal
      // e.g. using chai.
      expect(actual).deep.equal(expected);
    });
  })
  describe("Rxjs testing", () => {
    let el: EagRouter;
    before(async () => {
      el = await fixture(html` <eag-router .routes=${routes}></eag-router> `);
    });
    it("run marbles well", async () => {
       const navEvents$ = navigationEvents$;
        const doneSubject$ = new BehaviorSubject('');
        const done$ = doneSubject$.pipe(filter(sub => sub.length > 0))
        const outputs$ = navEvents$.pipe(buffer(done$), shareReplay());
  
    // @ts-ignore
      await el.changeRoute({routePath: '/two'})

      await el.updateComplete
      const promise = new Promise((resolve, _) => {
        setTimeout(() => {
          resolve(123);
        }, 1500);
      });
      await promise;
      doneSubject$.next("done");

      
      testScheduler.run( async helpers => {
        const { cold, expectObservable, expectSubscriptions } = helpers;

        const e1 =  cold('-a--b--c---|');
        
        // let nav: NavState = 'navCold'

          const expected = '  400ms ^  a|'
          const sub = '^ -- !'
          expectObservable(outputs$).toBe(expected)

          // expectSubscriptions(e1.sub)


      })

    });
  });

  
});
