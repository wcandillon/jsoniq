/// <reference path="../../../typings/tsd.d.ts" />
import * as u from "./Utils";

describe("JSON Support: ", () => {

    it("Navigation 1", () => {
        return u.expectQuery("let $foo := { a: 1 } let $a := \"a\" return $foo.$a").toEqual([1]);
    });

    it("Navigation 2", () => {
        return u.expectQuery("let $foo := { a: 1 } return $foo.a").toEqual([1]);
    });
});
