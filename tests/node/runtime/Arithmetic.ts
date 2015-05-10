/// <reference path="../../../typings/tsd.d.ts" />
require("jasmine2-pit");
import u = require("./Utils");

declare function pit(expectation: string, assertion?: (done: () => void) => any): void;

describe("Test Arithmetic Operation: ", () => {

    pit("()", () => {
        return u.expectQuery("()").then(e => {
            e.toEqual([]);
        });
    });

    pit("null 1", () => {
        return u.expectQuery("null", true).then(e => {
            e.toEqual([null]);
        });
    });

    pit("null 2", () => {
        return u.expectQuery("null, null", true).then(e => {
            e.toEqual([null, null]);
        });
    });

    pit("null 3", () => {
        return u.expectQuery("1, null, null", true).then(e => {
            e.toEqual([1, null, null]);
        });
    });

    pit("boolean", () => {
        return u.expectQuery("true, false", true).then(e => {
            e.toEqual([true, false]);
        });
    });

    pit("primitives 1", () => {
        return u.expectQuery("true, false, null, 2", true).then(e => {
            e.toEqual([true, false, null, 2]);
        });
    });

    pit("primitives 2", () => {
        return u.expectQuery("null, (), false, null, ((), (), true)", true).then(e => {
            e.toEqual([null, false, null, true]);
        });
    });

    pit("add(1, 1)", () => {
        return u.expectQuery("1 + 1").then(e => {
            e.toEqual([2]);
        });
    });

    pit("add(1, 1.5)", () => {
        return u.expectQuery("2 + 1.5").then(e => {
            e.toEqual([3.5]);
        });
    });

    pit("multiple operations", () => {
        return u.expectQuery(
            "1 + 1 + 1 - 1 - 1 + 10 - 1, (1 to 5), (1, (), 2, 3), 20.1 idiv 1.678, 10 div 2, 2 * 5, true, false, \"Hello\", \"World\"",
            true
        ).then((e: jasmine.Matchers) => {
            e.toEqual([10, 1, 2, 3, 4, 5, 1, 2, 3, 11, 5, 10, true, false, "Hello", "World"]);
        });
    });

    pit("to(1, add(5, 1))", () => {
        return u.expectQuery("(1 to 5 + 1)").then((e: jasmine.Matchers) => {
            e.toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
