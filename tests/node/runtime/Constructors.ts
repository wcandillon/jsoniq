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


    pit("()", () => {
        return u.expectQuery("((1 + 1, 2), 3, (4 + 0), (5))").then(e => {
            e.toEqual([2, 2, 3, 4, 5]);
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

    pit("object 1", () => {
        return u.expectQuery("{}, {}, 1, ({}, 2)", true).then(e => {
            e.toEqual([{}, {}, 1, {}, 2]);
        });
    });

    pit("object 2", () => {
        return u.expectQuery("{ \"foo\": 1 + 1 }", true).then(e => {
            e.toEqual([{ foo: 2 }]);
        });
    });

    pit("object 3", () => {
        return u.expectQuery("{ foo: 1, \"bar\": (1 + 1, 2) }", true).then(e => {
            e.toEqual([{ foo: 1, "bar": [2, 2] }]);
        });
    });


});
