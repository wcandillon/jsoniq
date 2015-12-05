/// <reference path="../../../typings/tsd.d.ts" />
require("jasmine2-pit");
import * as u from "./Utils";

describe("Test Item Constructors: ", () => {

    it("()", () => {
        var e = u.expectQuery("()");
        e.toEqual([]);
    });

    it("seq", () => {
        var e = u.expectQuery("((1 + 1, 2), 3, (4 + 0), (5))");
        e.toEqual([2, 2, 3, 4, 5]);
    });

    it("null 1", () => {
        var e = u.expectQuery("null", true);
        e.toEqual([null]);
    });

    it("null 2", () => {
        var e = u.expectQuery("null, null", true);
        e.toEqual([null, null]);
    });

    it("null 3", () => {
        var e = u.expectQuery("1, null, null", true);
        e.toEqual([1, null, null]);
    });

    it("boolean", () => {
        var e = u.expectQuery("true, false", true);
        e.toEqual([true, false]);
    });

    it("primitives 1", () => {
        var e = u.expectQuery("true, false, null, 2", true);
        e.toEqual([true, false, null, 2]);
    });

    it("primitives 2", () => {
        var e = u.expectQuery("null, (), false, null, ((), (), true)", true);
        e.toEqual([null, false, null, true]);
    });

    it("object 1", () => {
        var e = u.expectQuery("{}, {}, 1, ({}, 2)", true);
        e.toEqual([{}, {}, 1, {}, 2]);
    });

    it("object 2", () => {
        var e = u.expectQuery("{ \"foo\": 1 + 1 }", true);
        e.toEqual([{ foo: 2 }]);
    });

    it("object 3", () => {
        var e = u.expectQuery("{ foo: 1, \"bar\": (1 + 1, 2) }", true);
        e.toEqual([{ foo: 1, "bar": [2, 2] }]);
    });

    it("object 4", () => {
        var e = u.expectQuery("{ (\"foo\", 2): 1, \"bar\": (1 + 1, 2) }", true);
        e.toEqual([{ foo: 1, "bar": [2, 2] }]);
    });

    it("array 1", () => {
        var e = u.expectQuery("[1, 1 + 1, 1 + 1 + 1]", true);
        e.toEqual([[1, 2, 3]]);
    });

    it("array 2", () => {
        var e = u.expectQuery("[1, 2, 3]", true);
        e.toEqual([[1, 2, 3]]);
    });
});
