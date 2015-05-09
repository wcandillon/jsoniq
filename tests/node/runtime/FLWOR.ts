/// <reference path="../../../typings/tsd.d.ts" />
require("jasmine2-pit");
import u = require("./Utils");

declare function pit(expectation: string, assertion?: (done: () => void) => any): void;

describe("Test FLWOR", () => {

    pit("for", () => {
        return u.expectQuery("for $z at $y in (2 to 5) return $z * $y").then(e => {
            e.toEqual([2, 6, 12, 20]);
        });
    });

    pit("for 2", () => {
        return u.expectQuery("for $i at $a in (1 to 2) for $z at $y in (2 to 5) return $z * $y * $a").then(e => {
            e.toEqual([2, 6, 12, 20, 4, 12, 24, 40]);
        });
    });

    pit("for 3", () => {
        return u.expectQuery("for $z at $y in (for $i in (2 to 5) return $i) return $z * $y").then(e => {
            e.toEqual([2, 6, 12, 20]);
        });
    });

    pit("for 4", () => {
        return u.expectQuery("for $i in (1 to 2) for $z at $y in (for $i in (2 to 5) return $i) return $z * $y").then(e => {
            e.toEqual([2, 6, 12, 20, 2, 6, 12, 20]);
        });
    });

    pit("for 5", () => {
        return u.expectQuery("for $z in (for $i in (2 to 5) return $i) return $z").then(e => {
            e.toEqual([2, 3, 4, 5]);
        });
    });
});
