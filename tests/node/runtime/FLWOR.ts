/// <reference path="../../../typings/tsd.d.ts" />
require("jasmine2-pit");
import u = require("./Utils");

declare function pit(expectation: string, assertion?: (done: () => void) => any): void;

describe("Test Arithmetic Operation", () => {

    pit("for", () => {
        return u.expectQuery("for $z at $y in (2 to 5) return $z * $y").then(e => {
            e.toEqual([2, 6, 12, 20]);
        });
    });
});
